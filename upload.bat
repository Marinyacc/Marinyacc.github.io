@echo off
echo 开始推送到 GitHub...

git add .
git commit -m "update %date% %time%"
git push origin main

echo 推送完成！
pause