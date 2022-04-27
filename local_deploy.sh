#/bin/bash
datetime="`date '+%D %T'`"

git add .
echo "####### Git Add ALL #######"
git commit -m "Master commit: $1 Datetime: $datetime"
echo "####### Git commit master #######"
git pull origin master
echo "####### Git pull master #######"
git push -u origin master
echo "####### Push Git Master #######"