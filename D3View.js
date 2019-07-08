
var XS = ShapeWeight / 2, YS = ShapeHeight / 2;
var IDS = {};
var svg = d3.select("#svgcontainer").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-20 -20 " + w + " " + h)
    //this is to zoom out
    //.attr("viewBox", "-20 -20 1600 1600")
    .style("padding", 5)
    .style("margin", 5)
    .on("click", function (d) {
        var XX, YY;
        var mouse = d3.mouse(this);
        mouse[0] = Math.floor(mouse[0]);

        if (mouse[0] % 50 > 25)
            XX = ((Math.floor(mouse[0] / 50) + 1) * 50 - 15);
        else
            XX = Math.floor(mouse[0] / 50) * 50 - 15;
        if (mouse[1] % 50 > 25)
            YY = (Math.floor(mouse[1] / 50) + 1) * 50 - 15;
        else
            YY = (Math.floor(mouse[1] / 50) * 50 - 15);

        if (!grid.isWalkableAt(XX / 5 + 5, YY / 5 + 5))
            return;

        for (var i = -1; i < 8; i++)
            for (var j = -1; j < 8; j++)
                grid.setWalkableAt(j + XX / 5, i + YY / 5, false);


        //paint the rectangle
        dragrect(XX, YY);
    });

var xScale = d3.scaleLinear()
    //accepts
    .domain([0, 100])
    //outputs
    .range([0, w]);

var yScale = d3.scaleLinear()
    //accepts
    .domain([0, 100])
    //outputs
    .range([0, h]);

//PREPARE AXES  
var xAxisBottom = d3.axisBottom(xScale).ticks(20);
var xAxisTop = d3.axisTop(xScale).ticks(20);
var yAxisLeft = d3.axisLeft(yScale).ticks(20);
var yAxisRight = d3.axisRight(yScale).ticks(20);


//PREPARE GRIDS
//MAIN
var ygridlines = d3.axisTop()
    .tickFormat("")
    .tickSize(-h)
    .ticks(20)
    .scale(xScale);

var xgridlines = d3.axisLeft()
    .tickFormat("")
    .tickSize(-w)
    .ticks(20)
    .scale(yScale);

//MINOR
var ygridlinesmin = d3.axisTop()
    .tickFormat("")
    .tickSize(-h)
    .ticks(200)
    .scale(xScale);

var xgridlinesmin = d3.axisLeft()
    .tickFormat("")
    .tickSize(-w)
    .ticks(200)
    .scale(yScale);
//DRAW GRIDS
//MINOR GRID
svg.append("g")
    .attr("class", "minor-grid")
    .call(ygridlinesmin);

svg.append("g")
    .attr("class", "minor-grid")
    .call(xgridlinesmin);

//MAIN GRID
svg.append("g")
    .attr("class", "main-grid")
    .call(ygridlines);

svg.append("g")
    .attr("class", "main-grid")
    .call(xgridlines);


var lineGenerator = d3.line().curve(d3.curveBasis)
    .x(function (d) { return d[0] * 5 })
    .y(function (d) { return d[1] * 5 });

var freeline = (path, ID) => {
    svg.append("path")
        .attr("id", ID)
        .attr("class", "freeline")
        .style("stroke", function () {
            // return "hsl(" + Math.random() * 360 + ",100%,50%)";
            return "4C09D2";
        })

        .attr("d", function (d) { return path; });
};

var drag = d3.drag()
    .on("drag", dragmove);
var startX = 0, startY = 0;
var dragrect = (x, y) => {
    idRect = x/5 + XS ;
    idRect = idRect.toString(16) + (y/5 + YS).toString(16);
    svg.append("rect")
        .attr("id", idRect)
        .attr("x", function (d) { return x; })
        .attr("y", function (d) { return y; })
        .attr("centreX", x + XS * 5)
        .attr("centreY", y + YS * 5)
        .attr("height", yScale(3))
        .attr("width", xScale(3))
        .attr("fill", "white")
        .attr("stroke", "#000000")
        .attr("stroke-width", "1")
        .attr("cursor", "pointer")
        .on("mouseout", function (d, i) {
            d3.select(this).attr("fill", function () {
                return "" + "#ffffff" + "";
            });
        })
        // .call(drag)
        .on("click", async function (d, i) {
            // d3.event.preventDefault();
            if (!startX) {

                startX = d3.select(this).attr("centreX");
                startY = d3.select(this).attr("centreY");
                d3.select(this).attr("fill", "black");
            }
            else {

                endX = d3.select(this).attr("centreX");
                endY = d3.select(this).attr("centreY");
                d3.select(this).attr("fill", "green");
                if(!IDS[d3.select(this).attr("id")])
                IDS[d3.select(this).attr("id")]=new Array();
                if(!IDS[parseInt(startX/5).toString(16) +""+ parseInt(startY/5).toString(16)])
                IDS[parseInt(startX/5).toString(16) +""+ parseInt(startY/5).toString(16)]=new Array();
                IDS[d3.select(this).attr("id")].push(parseInt(startX/5).toString(16) +""+ parseInt(startY/5).toString(16));
                IDS[parseInt(startX/5).toString(16) +""+ parseInt(startY/5).toString(16)].push(d3.select(this).attr("id"));
               // console.log(IDS[parseInt(startX/5).toString(16) +""+ parseInt(startY/5).toString(16)]);

                //finding the path
                /**** here we search for two links: link direct (start to end) && the inversed (end to start)
                 *    after that we choose the link which has the minimum number of corners.
                */
                var link1 = await onsearch(startX / 5, startY / 5, endX / 5, endY / 5);
                var linkInverse = await onsearch(endX / 5, endY / 5, startX / 5, startY / 5);

                var xx = startX / 5, yy = startY / 5, x = endX / 5, y = endY / 5;
                if (link1.corners <= linkInverse.corners) {
                    for (var i = 0; i < XS; i++) {
                        if ((link1.path[0][0] < xx + XS && link1.path[0][0] > xx - XS) && (link1.path[0][1] < yy + YS && link1.path[0][1] > yy - YS)) link1.path.shift();
                        if ((link1.path[link1.path.length - 1][0] < x + XS && link1.path[link1.path.length - 1][0] > x - XS) && (link1.path[link1.path.length - 1][1] < y + YS && link1.path[link1.path.length - 1][1] > y - YS))
                            link1.path.pop();
                    }
                    freeline(lineGenerator(link1.path), parseInt(xx).toString(16) + parseInt(yy).toString(16) + parseInt(x).toString(16) + parseInt(y).toString(16));
                }

                else {
                    for (var i = 0; i < XS; i++) {
                        if ((linkInverse.path[0][0] < x + XS && linkInverse.path[0][0] > x - XS) && (linkInverse.path[0][1] < y + YS && linkInverse.path[0][1] > y - YS)) linkInverse.path.shift();
                        if ((linkInverse.path[linkInverse.path.length - 1][0] < xx + XS && linkInverse.path[linkInverse.path.length - 1][0] > xx - XS) && (linkInverse.path[linkInverse.path.length - 1][1] < yy + YS && linkInverse.path[linkInverse.path.length - 1][1] > yy - YS))
                            linkInverse.path.pop();
                    }

                    freeline(lineGenerator(linkInverse.path), parseInt(x/5).toString(16) + parseInt(y/5).toString(16) + parseInt(xx).toString(16) + parseInt(yy).toString(16));
                }

                startX = startY = 0;
            }

            //    d3.event.stopPropagation();


        })

}
function dragmove(d) {

    var xx = (d3.event.x - 20) - (d3.event.x) % 50 + 5;
    var yy = (d3.event.y - 20) - (d3.event.y) % 50 + 5;
    var CurrentID=d3.select(this).attr("id");
      
    if(xx<25 || yy<25) return;
    if (!grid.isWalkableAt(xx / 5, yy / 5)) return;

    if (xx < d3.select(this).attr("x") || yy < d3.select(this).attr("y") || xx > parseInt(d3.select(this).attr("x")) + XS * 10 ||
        yy > parseInt(d3.select(this).attr("y")) + YS * 10) {


        for (var i = -1; i <= 7; i++)
            for (var j = -1; j <= 7; j++) {
                grid.setWalkableAt(j + xx / 5, i + yy / 5, false);
                grid.setWalkableAt(j + d3.select(this).attr("x") / 5, i + d3.select(this).attr("y") / 5, true);

            }

        
        d3.select(this)
            .attr("x", function (d) { return xx; })
            .attr("centreX", xx + 15);


        d3.select(this)
            .attr("y", function (d) { return yy; })
            .attr("centreY", yy + 15);

        var NewId = (parseInt(d3.select(this).attr("centreX"))/5).toString(16) + (parseInt(d3.select(this).attr("centreY"))/5).toString(16);

        var myarray = IDS[CurrentID];
        if(myarray)
        {
            //console.log(myarray);

        var myarray2,x,y;
        Array.prototype.forEach.call(myarray,async (elem,index) => {

            let ELEM = elem;
            myarray2 =IDS[ELEM];
            if(myarray2)
            {   
            Array.prototype.forEach.call(myarray2,(elem1,index1) => {
                if (elem1 == CurrentID)
                myarray2[index1] = NewId;
            });
            }
            
            
            console.log(ELEM , CurrentID);
            d3.select('[id="'+ELEM + CurrentID+'"]').remove();
            d3.select('[id="'+CurrentID + ELEM+'"]').remove();
            
            

            let XX = parseInt(ELEM.slice(0,2),16);
            let YY = parseInt(ELEM.slice(2,4),16); 
            let X = parseInt(NewId.slice(0,2),16);; 
            let Y = parseInt(NewId.slice(2,4),16);

            console.log(XX,YY,X,Y);

            var linkInverse = await onsearch(XX,YY,X,Y);
            var  link1= await onsearch(X, Y,XX,YY);

            if (link1.corners <= linkInverse.corners) {
                for (var i = 0; i < XS; i++) {
                    if ((link1.path[0][0] < XX + XS && link1.path[0][0] > XX - XS) && (link1.path[0][1] < YY + YS && link1.path[0][1] > YY - YS)) link1.path.shift();
                    if ((link1.path[link1.path.length - 1][0] < X + XS && link1.path[link1.path.length - 1][0] > X - XS) && (link1.path[link1.path.length - 1][1] < Y + YS && link1.path[link1.path.length - 1][1] > Y - YS))
                        link1.path.pop();
                }
                freeline(lineGenerator(link1.path),XX.toString(16)+ YY.toString(16)+ X.toString(16) + Y.toString(16));
            }

            else {
                for (var i = 0; i < XS; i++) {
                    if ((linkInverse.path[0][0] < X + XS && linkInverse.path[0][0] > X - XS) && (linkInverse.path[0][1] < Y + YS && linkInverse.path[0][1] > Y - YS)) linkInverse.path.shift();
                    if ((linkInverse.path[linkInverse.path.length - 1][0] < XX + XS && linkInverse.path[linkInverse.path.length - 1][0] > XX - XS) && (linkInverse.path[linkInverse.path.length - 1][1] < YY + YS && linkInverse.path[linkInverse.path.length - 1][1] > YY - YS))
                        linkInverse.path.pop();
                }

                freeline(lineGenerator(linkInverse.path), X.toString(16) + Y.toString(16) +XX.toString(16)+ YY.toString(16));
            }
        
        });


        delete IDS[d3.select(this).attr("id")];
        IDS[NewId]=myarray;
        d3.select(this).attr("id",NewId);
    }
    else{
        delete IDS[d3.select(this).attr("id")];
        IDS[NewId]=myarray;
        d3.select(this).attr("id",NewId);

    }
        


    }



}
