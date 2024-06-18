from django.db import models

class AvatarImages(models.Model):
  file_name = models.CharField(max_length=255)
  file_db = models.ImageField(upload_to="img/")

  class Meta:
    db_table = 'avatar_images'

  def __str__(self):
    return f"File name: {self.file_name}"

  @property
  def url(self):
    return f"localhost:8000{self.file_db.url}"

  def delete(self):
    self.file_db.delete()
    super(AvatarImages, self).delete()
