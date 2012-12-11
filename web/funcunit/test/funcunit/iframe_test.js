module("Iframe Test")

test("iframe that doesn't exist", function(){
	S.open("//funcunit/test/iframe/haveframe.html")
	S("#open").click();
	S("#title", "my frame").visible("Added frame query works");
})

test('replacing an iframe', function() {
	S.open("//funcunit/test/iframe/replaceframe.html");
	//check for h1 in current iframe
	S('#title', 'my frame').exists();
	S('div').click();

	//check for h2 in new iframe
	S('#new-title', 'my frame').exists("Replaced frame query works");
})