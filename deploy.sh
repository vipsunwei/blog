#!/usr/bin/env sh

# 先把代码提交到GitHub
rm -rf .git/
rm -rf blog/.vuepress/dist/

git init
git add .
git commit -m 'git push origin master'
# git remote add origin git@github.com:vipsunwei/blog.git
git push -f git@github.com:vipsunwei/blog.git master:master

rm -rf .git/


# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd blog/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:vipsunwei/vipsunwei.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:vipsunwei/blog.git master:gh-pages

cd -