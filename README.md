# Ativos Neg?cios Locais

Landing responsiva com HTML renderizado por Flask/Jinja, CSS e JavaScript nativos. Este reposit?rio cont?m apenas a aplica??o, as m?dias em uso e os arquivos necess?rios para execu??o. N?o usa banco de dados ou etapa de build Node.

## Publicar no EasyPanel

1. Crie um servi?o **App** e selecione este reposit?rio na origem GitHub/Git, branch `main`.
2. Em Build, escolha **Dockerfile**, caminho `Dockerfile`, contexto na raiz do reposit?rio.
3. Em Domains, configure a porta interna de destino **8504**.
4. Configure `WHATSAPP_NUMBER` no ambiente do servi?o, com c?digo do pa?s e DDD, apenas n?meros. Sem essa vari?vel, os tr?s bot?es de contato ficam desativados.
5. Execute Deploy. O comando padr?o da imagem j? inicia o Waitress em `0.0.0.0:8504`.

A porta do cont?iner ? fixa em 8504. Deixe o comando de inicializa??o padr?o e mantenha `PORT=8504` se definir essa vari?vel. N?o h? necessidade de volume persistente. O healthcheck consulta `/`.

Documenta??o oficial: [servi?o App](https://easypanel.io/docs/services/app) e [build com Dockerfile](https://easypanel.io/docs/builders).

## Executar com Docker

```sh
docker build -t ativos-landing .
docker run --rm -p 8504:8504 --env WHATSAPP_NUMBER ativos-landing
```

Abra http://localhost:8504/.

## Executar com Python

Requer Python 3.12. Crie e ative um ambiente virtual, depois:

```sh
python -m pip install -r requirements/production.txt
waitress-serve --host=0.0.0.0 --port=8504 --threads=4 --call app:create_app
```

As configura??es de GitHub usadas no computador de desenvolvimento n?o s?o necess?rias no ambiente da landing. Os arquivos `.env` e tokens n?o acompanham este reposit?rio. As licen?as das fontes est?o em `app/static/fonts/*/OFL.txt`.
