NAME = ft_transcendence
DOCKER-COMPOSE = docker-compose
YML = ./srcs/docker-compose.yaml

all: $(NAME)

$(NAME):
	$(DOCKER-COMPOSE) -p $(NAME) -f $(YML) up --build

clean:
	$(DOCKER-COMPOSE) -p $(NAME) -f $(YML) down

fclean: clean

re: fclean all
.PHONY: all clean fclean re
