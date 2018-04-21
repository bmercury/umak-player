var context = null;

function initVisualizer(audioFile) {
    var audio = audioFile
    audio.load();
    audio.play();
    context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    var canvas = document.getElementById("visualizer-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        x = 0;
        analyser.getByteFrequencyData(dataArray);

        var moreThan25 = 0;
        var moreThan50 = 0;
        var moreThan70 = 0;
        var moreThan100 = 0;
        var moreThan140 = 0;
        var totalHeight = 0;
        for (var i = 0; i < bufferLength; i++) {
            if(dataArray[i]>=25)moreThan25++;
            if(dataArray[i]>=50)moreThan50++;
            if(dataArray[i]>=70)moreThan70++;
            if(dataArray[i]>=100)moreThan100++;
            if(dataArray[i]>=140)moreThan140++;
            totalHeight+=dataArray[i];
        }
        // console.log(totalHeight);

        var redExpression = 55+moreThan70;
        var blueExpression = (redExpression>100)?moreThan25:55+moreThan100;
        var greenExpression = (redExpression+blueExpression>310)?55+Math.floor(moreThan100/5):55;
        if(redExpression+blueExpression+greenExpression>270){
            redExpression -= 5;
            blueExpression -= 5;
            greenExpression = moreThan100;
        }
        
        ctx.fillStyle = "rgb("+redExpression+","+greenExpression+","+blueExpression+")";
        
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            // console.log(barHeight);

            var newColors = getNewColors(barHeight);

            var r = newColors.r;
            var g = newColors.g;
            var b = newColors.b;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth-1;
        }
    }
  
    renderFrame();
  };

function getFillStyle(buffer, dataArray){
    var moreThan25 = 0;
    var moreThan50 = 0;
    for (var i = 0; i < bufferLength; i++) {
        if(dataArray[i]>25 && dataArray[i]<50)moreThan25++;
        if(dataArray[i]>50)moreThan50++;
    }

    return "rgb(50,50,50)";

}

function getNewColors(barHeight){
    var max_r = 180, min_r = 50;
    var max_g = 255, min_g = 10;
    var max_b = 255, min_b = 10;
    var r,g,b;
    r=Math.floor(0+(barHeight-20));
    g=Math.floor(190-(barHeight/5));
    b=Math.floor(100-Math.random()*50);

    if(r>max_r)r=max_r;
    if(r<min_r)r=min_r;

    if(g>max_g)g=max_g;
    if(g<min_g)g=min_g;

    if(b>max_b)b=max_b;
    if(b<min_b)b=min_b;

    return {r:r,g:g,b:b};
}