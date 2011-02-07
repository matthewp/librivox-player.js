version = '0.2'
releasefile = '..\librivox-player-'$version'.js'

files[0] = 'simple-javascript-inheritance.js'
files[1] = 'root.js'
files[2] = 'util.js'
files[3] = 'book.js'
files[4] = 'search.js'
files[5] = 'player.js'

for file in ${files[@]}
do
	cat $name >> $releasefile
done