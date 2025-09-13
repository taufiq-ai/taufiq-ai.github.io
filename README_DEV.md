
```sh
# run jekyll on local
docker run --rm -v "$PWD":/usr/src/app -p 4000:4000 jekyll/jekyll:latest jekyll serve --host 0.0.0.0

# OR

docker run --rm -v "$PWD":/usr/src/app -p 4000:4000 -w /usr/src/app jekyll/jekyll:latest sh -c "gem install webrick && jekyll serve --host 0.0.0.0"
```