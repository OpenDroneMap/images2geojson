/**
 *  images2geojson
 *  Copyright (C) 2018-present MasseranoLabs LLC
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
'use strict';

const fs = require('fs');
const turf = require('@turf/turf')

let argDefs = {
    string: ['input', 'output'],
    boolean: ['verbose'],
    alias: {
        i: 'input',
        o: 'output',
        v: 'verbose'
    }
};
let argv = require('minimist')(process.argv.slice(2), argDefs);

if (argv.help || !argv.i || !argv.o){
	console.log(`
Usage: node index.js [options]

Purpose: Convert OpenDroneMap's images.json database into GeoJSON format 

Options:
    -i, --input <path>	Path to OpenDroneMap's images.json file
    -o, --output <path>	Output file path (.geojson)
    -v, --verbose Verbose output
`);
	process.exit(0);
}


try{
    if (argv.verbose) console.log(`Reading from ${argv.i}...`);

    const images = JSON.parse(fs.readFileSync(argv.i).toString());
    const collection = turf.featureCollection(images.map(i => turf.point([i.longitude, i.latitude], i)));
    
    if (argv.verbose) console.log(`Writing ${images.length} points to ${argv.i}...`);
    fs.writeFileSync(argv.o, JSON.stringify(collection));

    if (argv.verbose) console.log("Done!");
}catch(e){
    console.warn(`Error: ${e.message}`);
    process.exit(1);
}

