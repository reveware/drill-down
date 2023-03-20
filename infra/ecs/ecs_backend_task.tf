resource "aws_ecs_task_definition" "backend_task_definition" {
  family = "${local.project_name}-backend-task"
  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "hello-world:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
    }
  ])
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.backend_role.arn
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
}


resource "aws_ecs_service" "ecs_backend_service" {
  name                = "${local.project_name}-backend-service"
  cluster             = aws_ecs_cluster.ecs_cluster.id
  task_definition     = aws_ecs_task_definition.backend_task_definition.arn
  launch_type         = "FARGATE"
  desired_count       = 1
  scheduling_strategy = "REPLICA"

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.ecs_tasks.id, aws_security_group.alb.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.alb_target_group.arn
    container_name   = "app"
    container_port   = 80
  }

  depends_on = [aws_alb_listener.alb_listener]
}
