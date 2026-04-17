import json
import os
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import redis
from .models import Prompt

r = redis.Redis(
    host=os.environ.get('REDIS_HOST', 'redis'),
    port=int(os.environ.get('REDIS_PORT', 6379)),
    db=0,
    decode_responses=True
)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def prompt_list_create(request):
    if request.method == "GET":
        prompts = Prompt.objects.all().order_by('-created_at')
        data = [
            {
                "id": str(p.id),
                "title": p.title,
                "complexity": p.complexity,
                "created_at": p.created_at.isoformat()
            } for p in prompts
        ]
        return JsonResponse(data, safe=False)
    
    elif request.method == "POST":
        try:
            body = json.loads(request.body)
            title = body.get('title', '').strip()
            content = body.get('content', '').strip()
            complexity = body.get('complexity')
            
            if len(title) < 3:
                return JsonResponse({'error': 'Title must be at least 3 characters'}, status=400)
            if len(content) < 20:
                return JsonResponse({'error': 'Content must be at least 20 characters'}, status=400)
            try:
                complexity = int(complexity)
                if complexity < 1 or complexity > 10:
                    raise ValueError
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Complexity must be an integer between 1 and 10'}, status=400)
                
            prompt = Prompt.objects.create(title=title, content=content, complexity=complexity)
            return JsonResponse({
                "id": str(prompt.id),
                "title": prompt.title,
                "content": prompt.content,
                "complexity": prompt.complexity,
                "created_at": prompt.created_at.isoformat()
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': f"Exception: {str(e)}\n\n{traceback.format_exc()}"}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def prompt_detail(request, pk):
    try:
        prompt = Prompt.objects.get(pk=pk)
    except Prompt.DoesNotExist:
        return HttpResponseNotFound(json.dumps({'error': 'Prompt not found'}), content_type='application/json')
        
    # Increment view count in Redis
    key = f"prompt:{prompt.id}:views"
    try:
        view_count = r.incr(key)
    except Exception as e:
        print(f"Redis error: {e}")
        try:
            view_count = r.get(key)
        except:
            view_count = 0
        
    return JsonResponse({
        "id": str(prompt.id),
        "title": prompt.title,
        "content": prompt.content,
        "complexity": prompt.complexity,
        "created_at": prompt.created_at.isoformat(),
        "view_count": view_count
    })
