from django.db import models
from ninja import Router, UploadedFile, Schema
from ninja.errors import HttpError
from rich import inspect

from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

import os


# Create your models here.
router = Router()
from app.settings import MEDIA_URL

class FileUpload(models.Model):
    title = models.CharField(default="", max_length=255)
    file_db =  models.ImageField(upload_to="img/")
    
    @property
    def url(self):
        # Hard code HOST url
        return f"localhost:8000{self.file_db.url}"

    def delete(self):
        self.file_db.delete()
        super(FileUpload, self).delete()

    


@router.post(
    "/ninja/",
    response={
        200: dict
    }
)
def post_upload_file(request, file: UploadedFile):
    """
    Upload File
    """
    # 
    # inspect(file)
    
    f = FileUpload.objects.create(
        title=file.name,
        file_db=file,
    )
    
    
    return 200, {
        "link": f.url
    }

class simpleListOut(Schema):
    id: int
    url: str

@router.get(
    "/list-file",
    response={
        200: list[simpleListOut],
    }
)
def get_all_uploadfile(request):
    return FileUpload.objects.all()

@router.delete(
    "/upload-file/{f_id}/",
    response={
        200:dict
    }
)
def delete_file_by_id(request, f_id: int):
    """
    """
    fi = FileUpload.objects.filter(id = f_id).first()
    if fi is not None:
        file_obj = fi.file_db
        # file_obj.delete()
        fi.delete()
    else:
        raise HttpError(404, f"File Not Exist")
    
    return 200, {
        "message": f"Done delete {fi.id}"
    }