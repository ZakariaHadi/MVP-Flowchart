function Node(x, y, walkable) {

        this.x = x;

        this.y = y;

        this.walkable = (walkable === undefined ? true : walkable);
    }

    function Grid(width_or_matrix, height, matrix) {
        var width;

        if (typeof width_or_matrix !== 'object') {
            width = width_or_matrix;
        } else {
            height = width_or_matrix.length;
            width = width_or_matrix[0].length;
            matrix = width_or_matrix;
        }

        this.width = width;

        this.height = height;


        this.nodes = this._buildNodes(width, height, matrix);
    }

    /**
     * Build and return the nodes.
     * @private
     * @param {number} width
     * @param {number} height
     * @param {Array<Array<number|boolean>>} [matrix] - A 0-1 matrix representing
     *     the walkable status of the nodes.
     * @see Grid
     */
    Grid.prototype._buildNodes = function (width, height, matrix) {
        var i, j,
            nodes = new Array(height);

        for (i = 0; i < height; ++i) {
            nodes[i] = new Array(width);
            for (j = 0; j < width; ++j) {
                nodes[i][j] = new Node(j, i);
            }
        }


        if (matrix === undefined) {
            return nodes;
        }

        if (matrix.length !== height || matrix[0].length !== width) {
            throw new Error('Matrix size does not fit');
        }

        for (i = 0; i < height; ++i) {
            for (j = 0; j < width; ++j) {
                if (matrix[i][j]) {
                    // 0, false, null will be walkable
                    // while others will be un-walkable
                    nodes[i][j].walkable = false;
                }
            }
        }

        return nodes;
    };


    Grid.prototype.getNodeAt = function (x, y) {
        return this.nodes[y][x];
    };



    Grid.prototype.isWalkableAt = function (x, y) {
        return this.isInside(x, y) && this.nodes[y][x].walkable;
    };


    Grid.prototype.isInside = function (x, y) {
        return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
    };

    Grid.prototype.setWalkableAt = function (x, y, walkable) {
        this.nodes[y][x].walkable = walkable;
    };




    Grid.prototype.getNeighbors = function (node, endX, endY) {
        var x = node.x,
            y = node.y,
            neighbors = [],
            nodes = this.nodes;
        var test = true;

        if (endX > x) {
            if (endY > y) {
                for (var z = x; z <= endX; z++) {
                    if (!this.isWalkableAt(z, y)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                }
                else {
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);

                }
            }
            else {
                for (var z = x; z <= endX; z++) {
                    if (!this.isWalkableAt(z, y)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                }
                else {
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);

                }

            }
        }
        else {
            if (endY > y) {
                for (var z = x; z >= endX; z--) {
                    if (!this.isWalkableAt(z, y)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                }

                else {
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);

                }

            }
            else {
                for (var z = x; z >= endX; z--) {
                    if (!this.isWalkableAt(z, y)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                }
                else {
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);

                }
            }
        }


        return neighbors;
    }



    Grid.prototype.getNeighbors1 = function (node, endX, endY) {
        var x = node.x,
            y = node.y,
            neighbors = [],
            nodes = this.nodes;
        var test = true;

        if (endY > y) {
            if (endX > x) {
                for (var z = y; z <= endY; z++) {
                    if (!this.isWalkableAt(x, z)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                }
                else {
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);

                }
            }
            else {
                for (var z = y; z <= endY; z++) {
                    if (!this.isWalkableAt(x, z)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                }
                else {
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);

                }

            }
        }
        else {
            if (endX > x) {
                for (var z = y; z >= endY; z--) {
                    if (!this.isWalkableAt(x, z)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                }

                else {
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);

                }

            }
            else {
                for (var z = y; z >= endY; z--) {
                    if (!this.isWalkableAt(x, z)) { test = false; break; }
                }
                if (test) {
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                }
                else {
                    if (this.isWalkableAt(x - 1, y)) neighbors.push(nodes[y][x - 1]);
                    if (this.isWalkableAt(x + 1, y)) neighbors.push(nodes[y][x + 1]);
                    if (this.isWalkableAt(x, y + 1)) neighbors.push(nodes[y + 1][x]);
                    if (this.isWalkableAt(x, y - 1)) neighbors.push(nodes[y - 1][x]);

                }
            }
        }


        return neighbors;
    }

    Grid.prototype.clone = function () {
        var i, j,

            width = this.width,
            height = this.height,
            thisNodes = this.nodes,

            newGrid = new Grid(width, height),
            newNodes = new Array(height);

        for (i = 0; i < height; ++i) {
            newNodes[i] = new Array(width);
            for (j = 0; j < width; ++j) {
                newNodes[i][j] = new Node(j, i, thisNodes[i][j].walkable);
            }
        }

        newGrid.nodes = newNodes;

        return newGrid;
    };
    function backtrace(node) {
        var path = [[node.x, node.y]];
        while (node.parent) {
            node = node.parent;
            path.push([node.x, node.y]);
        }
        return path.reverse();
    }
    function AStarFinder(opt) {
        opt = opt || {};
        this.heuristic = function (dx, dy) { return dx + dy; };
        this.diagonalMovement = false;


    }

    function calculWeight(x, y, endx, endy, grid) {
        var firsty = y;
        var firstx = x;
        var z; var test = false;
        if (x < endx) {
            z = x;
            x = endx;
            endx = z;
        }

        if (y < endy) {
            z = y;
            y = endy;
            endy = z;
        }
        if (x !== endX) {

            for (z = x; z <= endx; z++) {
                if (!grid.isWalkableAt(z, firsty))
                    return 1000;
            }
            for (z = y; z <= endy; z++) {
                if (!grid.isWalkableAt(firstx, z))
                    return 1000;
            }
            return 3;


        }
        return 3;
    }

    /**
     * Find and return the the path.
     * @return {Array<Array<number>>} The path, including both start and
     *     end positions.
     */
    AStarFinder.prototype.findPath = async function (startX, startY, endX, endY, grid, test) {
        var openList = new Heap(function (nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
            startNode = grid.getNodeAt(startX, startY),
            endNode = grid.getNodeAt(endX, endY),
            heuristic = this.heuristic,
            diagonalMovement = this.diagonalMovement,
            weight = this.weight,
            abs = Math.abs, SQRT2 = Math.SQRT2,
            node, neighbors, neighbor, i, l, x, y, ng;

        startNode.g = 0;
        startNode.f = 0;

        // push the start node into the open list
        openList.push(startNode);
        startNode.opened = true;
        // while the open list is not empty
        while (!openList.empty()) {
            // pop the position of node which has the minimum `f` value.
            node = openList.pop();
            node.closed = true;
            // if reached the end position, construct the path and return it
            if (node === endNode) {
                // dir=1;
                var final = await backtrace(endNode);
                // console.log("ok" + final);
                return (final);
            }

            // get neigbours of the current node
            if (!test) neighbors = grid.getNeighbors(node, endX, endY);
            else neighbors = grid.getNeighbors1(node, endX, endY);

            for (i = 0, l = neighbors.length; i < l; ++i) {
                neighbor = neighbors[i];

                if (neighbor.closed) {
                    continue;
                }

                x = neighbor.x;
                y = neighbor.y;

                // get the distance between current node and the neighbor
                // and calculate the next g score
                ng = node.g + 1;

                // check if the neighbor has not been inspected yet, or
                // can be reached with smaller cost from the current node
                if (!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng;
                    neighbor.h = neighbor.h || calculWeight(x, y, endX, endY, grid) * heuristic(abs(x - endX), abs(y - endY));
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = node;

                    if (!neighbor.opened) {
                        openList.push(neighbor);
                        neighbor.opened = true;
                    } else {
                        // the neighbor can be reached with smaller cost.
                        // Since its f value has been updated, we have to
                        // update its position in the open list
                        openList.updateItem(neighbor);
                    }
                }
            } // end for each neighbor
        } // end while not open list empty

        // fail to find the path
        return ([]);
    };



    
	var Algorithme = new AStarFinder();
	var grid = new Grid(gridSize[0], gridSize[1]);


    var onsearch = async function (xx, yy, x, y) {
        var gridd, gridd1;
		var XS = ShapeWeight/2 , YS = ShapeHeight/2;
        gridd = grid.clone();
        gridd1 = grid.clone();

        for (var i = -YS-1; i < YS+2; i++)
            for (var j = -XS-1; j < XS+2; j++) {
                gridd.setWalkableAt(xx + j, yy + i, true);
                gridd.setWalkableAt(x + j, y + i, true);
                gridd1.setWalkableAt(xx + j, yy + i, true);
                gridd1.setWalkableAt(x + j, y + i, true);

            }
        if (xx == x) {
            var ExceptionPath = [];

            if (yy < y) {
                yy = yy - y;
                y = yy + y;
                yy = y - yy;
            }
            for (var k = yy; k >= y; k--) {
                if (!gridd.isWalkableAt(xx, k)) {
                    xx -= XS+2; x -= XS;
                    ExceptionPath.push([x, yy]);
                    ExceptionPath.push([x - 1, yy]);
                    for (var j = yy; j >= y; j--)
                        ExceptionPath.push([xx, j]);
                    ExceptionPath.push([x - 1, y]);
                    ExceptionPath.push([x, y]);
                    return { path: ExceptionPath, corners: 2 };
                }

            }
            for (var j = yy - YS; j >= y + YS; j--)
                ExceptionPath.push([xx, j]);
            return { path: ExceptionPath, corners: 2 };



        }

        else if (yy == y) {
            var ExceptionPath = [];

            if (xx < x) {
                xx = xx - x;
                x = xx + x;
                xx = x - xx;
            }

            for (var k = xx; k >= x; k--) {
                if (!gridd.isWalkableAt(k, y)) {
                    yy -= YS+2; y -= YS;
                    ExceptionPath.push([xx, y]);
                    ExceptionPath.push([xx, y - 1]);
                    for (var j = xx; j >= x; j--)
                        ExceptionPath.push([j, yy]);
                    ExceptionPath.push([x, y - 1]);
                    ExceptionPath.push([x, y]);
                    return { path: ExceptionPath, corners: 2 };

                }
            }
            for (var j = xx - XS; j >= x + XS; j--)
                ExceptionPath.push([j, yy]);
            return { path: ExceptionPath, corners: 2 };


        }

        path1 = await Algorithme.findPath(
            xx, yy, x, y, gridd, false);

        var cpt1 = 0, cpt2 = 0, fix = (path1[0][0] == path1[1][0]);
        for (var i = 0; i < path1.length - 1; i++) {
            if (path1[i][0] != path1[i + 1][0] && fix) {
                cpt1++;
                fix = false;
            }
            else if (path1[i][1] != path1[i + 1][1] && !fix) {
                cpt1++;
                fix = true;
            }
        }



        path2 = await Algorithme.findPath(
            xx, yy, x, y, gridd1, true);

        fix = (path2[0][0] == path2[1][0]);
        for (var i = 0; i < path2.length - 1; i++) {
            if (path2[i][0] != path2[i + 1][0] && fix) {
                cpt2++;
                fix = false;
            }
            else if (path2[i][1] != path2[i + 1][1] && !fix) {
                cpt2++;
                fix = true;
            }
        }

        if (cpt1 < cpt2) return {
            path: path1,
            corners: cpt1
        };

        else
            return {
                path: path2,
                corners: cpt2
            };
    }