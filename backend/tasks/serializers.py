from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("Title cannot be empty.")
        return value

    def validate_status(self, value):
        valid_statuses = ['pending', 'in_progress', 'done']
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Status must be one of: {', '.join(valid_statuses)}."
            )
        return value
