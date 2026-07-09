from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param is not None:
            valid_statuses = ['pending', 'in_progress', 'done']
            if status_param not in valid_statuses:
                raise ValidationError(
                    {"status": f"Invalid status '{status_param}'. Status must be one of: {', '.join(valid_statuses)}."}
                )
            queryset = queryset.filter(status=status_param)
        return queryset
