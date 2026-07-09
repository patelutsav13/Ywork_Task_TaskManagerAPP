from django.core.management.base import BaseCommand
from tasks.models import Task

class Command(BaseCommand):
    help = 'Seeds the database with initial sample tasks.'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing tasks...')
        Task.objects.all().delete()

        sample_tasks = [
            {
                'title': 'Set up Django Backend Project',
                'description': 'Initialize Django project, create tasks app, and configure CORS headers and settings.',
                'status': 'done'
            },
            {
                'title': 'Build REST APIs for Task Model',
                'description': 'Create Task models, serializers, and ViewSets to handle CRUD operations with status validation.',
                'status': 'done'
            },
            {
                'title': 'Develop React SPA Frontend',
                'description': 'Set up Vite with React, design CSS dashboard UI, and build TaskForm and TaskList components.',
                'status': 'in_progress'
            },
            {
                'title': 'Integrate Frontend with Backend API',
                'description': 'Hook up React Axios client with Django REST API for task creation, list fetching, and instant status updates.',
                'status': 'in_progress'
            },
            {
                'title': 'Draft Setup Documentation (README)',
                'description': 'Add installation, dependency lists, assumptions, project architecture, and run commands to README.md.',
                'status': 'pending'
            }
        ]

        for task_data in sample_tasks:
            Task.objects.create(**task_data)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(sample_tasks)} tasks.'))
