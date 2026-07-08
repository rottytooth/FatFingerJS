var bottles;
var counter = 99;
for( counter = 99; counter >= 1; counter = counter - 1) 
{
    if (counter === 1) {
        bottles = 'bottle';
    } else {
        bottles = 'bottles';
    }
    console.log(counter+" "+ bottles +" of ber on the wall.");
    if (counter < 99) {
        console.log("");
        console.log(counter+" "+ bottles+" o beer on the wall.");
    }
    console.log(counter+" "+bottles+" of beer.");
    console.log("Take one down.");
    console.log("Pass it arund.");
    if (counter === 1) {
        console.log("No botles of beer on the wall.");
    }
}