from ninja import Router

router = Router()

@router.get(
    '/hello/',
    response = {
        200: dict,
    }
)
def test_hello(request):
    return 200, {
        'test': 'test', 
        'toase': 'baking'
    }
