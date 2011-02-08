#!/bin/bash
version=$@
args=`echo ${#version}`

if [ $args == 0 ]
	then
		echo 'No arguments provided. Please provide a version number.'
		exit
fi

releasefile=librivox-player-$version.js

files[0]=simple-javascript-inheritance.js
files[1]=root.js
files[2]=util.js
files[3]=book.js
files[4]=search.js
files[5]=player.js

for file in ${files[@]}
do
	cat $file >> $releasefile
done

cd ..
git rm *.js
cd src
mv $releasefile ..
