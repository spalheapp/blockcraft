import Ola from "ola";

import game from '../classes/Game';
import world from '../classes/World';
import player from '../classes/Player';
import chat from '../classes/ChatManager';
import hud from '../gui/HUDClass';
import inventory from "../items/Inventory";
import { camera, g } from '../globals';
import keymap from "../../json/keymap.json"

let mouse = new Ola({ x: 0, y: 0 }, 10); // Mouse
let inScreen;

// Key event handling
$('html').mousedown(function (event) {
    if (!g.initialized)
        return;
    if (!player.controls.enabled || inventory.showInventory)
        return;
    switch (event.which) {
        case 1: // Left click
            player.punch();
            break;
        case 2: // Middle click
            event.preventDefault();
            player.getBlock();
            break;
        case 3: // Right click
            player.place = true;
            player.key.rightClick = Date.now();
            if (!player.key.lastRightClick)
                player.key.lastRightClick = Date.now();
            break;
        default:
        //alert('You have a strange Mouse!');
    }
})
$('html').mouseup(function (event) {
    if (!g.initialized)
        return;
    switch (event.which) {
        case 1:
            player.click = false;
            player.key.leftClick = false;
            break;
        case 2:

            break;
        case 3:
            player.place = false;
            player.key.rightClick = false;
            player.key.lastRightClick = false;
            break;
        default:
        //alert('You have a strange Mouse!');
    }
})

$(window).keydown(function (event) {
    if (!g.initialized) return;
    if (!player.controls.enabled) return;
    if (event.keyCode == 18) {
        event.preventDefault();
    }
    if (event.altKey && event.keyCode == 68) {
        event.preventDefault();
    }
    if (event.altKey && event.keyCode == 32) {
        event.preventDefault();
    }
});

$("body").mousemove(function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})

$("body").mousedown(function (e) {
    if (!g.initialized || !inventory.showInventory) return;
    switch (e.which) {
        case 1:
            inventory.selectInventory("left", true);
            g.mouseLeft = true;
            break;
        case 2:

            break;
        case 3:
            inventory.selectInventory("right", true);
            g.mouseRight = true;
            break;
        default:
        //alert('You have a strange Mouse!');
    }
}).mouseup(function (e) {
    if (!g.initialized || !inventory.showInventory) return;
    switch (e.which) {
        case 1:
            g.mouseLeft = false
            inventory.unselect();
            break;
        case 2:

            break;
        case 3:
            g.mouseRight = false;
            inventory.unselect();
            break;
        default:
        //alert('You have a strange Mouse!');
    }
})

$("body").dblclick(function () {
    if (!g.initialized) return;
    inventory.selectInventory("double")
})

var map = {};
onkeydown = onkeyup = function (e) {
    e = e || event;
    map[e.keyCode] = e.type == 'keydown';
}

var onKeyDown = function (event) {
    if (!g.initialized) return;

    // CHAT INPUT
    if (player.controls.enabled && ([13].indexOf(event.keyCode) > -1) && chat.showChatFlag) {
        chat.showChatFlag = false;
        chat.showChatBar = !chat.showChatBar;
        if (chat.showChatBar) {
            $("#chat-input").focus();
            $("#chat-input").css({ "background-color": "rgba(0, 0, 0, 0.4)" });
            chat.showChat = true;
            chat.hintText = "";
        } else {
            $("#chat-input").blur();
            $("#chat-input").css({ "background-color": "rgba(0, 0, 0, 0)" });
            commandIndex = -1;
        }

        let msg = $("#chat-input").val()
        if (!chat.showChatBar && msg) {
            if (msg[0] != "/") { // Send message to everyone
                socket.emit("message", $("#chat-input").val());
                $("#chat-input").val("")
            } else { // Check minecraft command
                if (prevCommands[0] != $("#chat-input").val()) {
                    prevCommands.unshift($("#chat-input").val());
                }
                $("#chat-input").val("")
                msg = msg.slice(1).removeExtraSpaces().split(" "); // Remove slash and split by spaces
                checkCommand(msg);
            }
            commandIndex = -1;
        }
    }

    if (!g.initialized || !player.controls.enabled || chat.showChatBar)
        return;

    // GAME CONTROLS
    if (keymap[event.keyCode] && keymap[event.keyCode][2]) {
        switch (keymap[event.keyCode][0]) {
            case "Attack":
                player.punch();
                break;
            case "Place Block":
                player.place = true;
                player.key.rightClick = Date.now();
                break;
            case "Move Forward":
                player.key.forward = 1;
                break;
            case "Move Left":
                player.key.left = 1;
                break;
            case "Move Backward":
                player.key.backward = -1;
                break;
            case "Move Right":
                player.key.right = -1;
                break;
            case "Jump":
                player.key.up = -1;
                break;
            case "Sprint":
                player.key.sprint = true;
                break;
            case "Sneak":
                player.key.sneak = true;
                player.key.down = 1;
                break;
            case "Fly":
                if (player.controls.enabled && player.allowFly) {
                    player.fly = !player.fly;
                    player.allowFly = false;
                }
                break;
            case "Clip":
                if (player.controls.enabled && player.allowClip) {
                    player.clip = !player.clip;
                    player.allowClip = false;
                }
                break;
            case "Drop Item":
                player.allowDrop = true;
                break;
            case "Respawn":
                if (player.controls.enabled && player.allowRespawn) {
                    player.respawn(world.blockSize);
                    socket.emit('respawn');
                    player.allowRespawn = false;
                }
                break;
            case "Zoom":
                camera.zoom = zoomLevel;
                camera.enableZoom = true;
                break;
            case "Player Tab":
                hud.showPlayerTab = true;
                break;
            case "Slot 1":
                player.currentSlot = 0;
                break;
            case "Slot 2":
                player.currentSlot = 1;
                break;
            case "Slot 3":
                player.currentSlot = 2;
                break;
            case "Slot 4":
                player.currentSlot = 3;
                break;
            case "Slot 5":
                player.currentSlot = 4;
                break;
            case "Slot 6":
                player.currentSlot = 5;
                break;
            case "Slot 7":
                player.currentSlot = 6;
                break;
            case "Slot 8":
                player.currentSlot = 7;
                break;
            case "Slot 9":
                player.currentSlot = 8;
                break;
        }
    }
};

var onKeyUp = function (event) {

    // CHAT INPUT
    if ([13].indexOf(event.keyCode) > -1) {
        chat.showChatFlag = true;
        return;
    }

    if (!g.initialized) return;

    // CREATIVE MENU CONTROLS
    if (event.keyCode == 38) {
        inventory.scroll(1);
        canChangeCommand = true;
    } else if (event.keyCode == 40) {
        inventory.scroll(-1);
        canChangeCommand = true;
    }

    if (event.keyCode == 39) {
        hud.heartUp = true;
    }

    if (chat.showChatBar) {
        // ARROW KEY CONTROLS
        if (event.keyCode == 38) {
            inventory.scroll(1);
            prevCommand();
        } else if (event.keyCode == 40) {
            inventory.scroll(-1);
            nextCommand();
        }

        // Give command hint
        chat.hintText = "";
        let msg = $("#chat-input").val()

        if (player && player.controls.enabled && chat.showChatFlag && msg && msg[0] == "/") {
            chat.hintText = "";
            msg = msg.slice(1).removeExtraSpaces().split(" "); // Remove slash and split by spaces
            giveCommandHint(msg, [9].indexOf(event.keyCode) > -1);
        }
    }


    // GAME CONTROLS
    if (keymap[event.keyCode] && keymap[event.keyCode][2]) {
        switch (keymap[event.keyCode][0]) {
            case "Attack":
                player.click = false;
                player.key.leftClick = false;
                break;
            case "Place Block":
                player.place = false;
                player.key.rightClick = false;
                break;
            case "Move Forward":
                player.key.forward = 0;
                break;
            case "Move Left":
                player.key.left = 0;
                break;
            case "Move Backward":
                player.key.backward = 0;
                break;
            case "Move Right":
                player.key.right = 0;
                break;
            case "Jump":
                player.key.up = 0;
                break;
            case "Sprint":
                player.key.sprint = false;
                break;
            case "Sneak":
                player.key.sneak = false;
                player.key.down = 0;
                break;
            case "Fly":
                player.allowFly = true;
                break;
            case "Clip":
                player.allowClip = true;
                break;
            case "Drop Item":
                player.allowDrop = false;
                break;
            case "Respawn":
                player.allowRespawn = true;
                break;
            case "Zoom":
                zoomLevel = 3;
                camera.enableZoom = false;
                camera.zoom = 1;
                break;
            case "Player Tab":
                hud.showPlayerTab = false;
                break;
        }
    }
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

// Inventory search
$(document).ready(function () {
    $("#search-input").on("input", function () {
        let search = $(this).val();
        inventory.updateItemSearch(search);
    });
});

// Scrolling
var lastScrollTop = 0;
let zoomLevel = 3
$(document).bind('wheel', function (e) {
    let scrollDelta = e.originalEvent.wheelDelta / 120;

    if (!g.initialized) return;

    if (inventory.showInventory && player.mode == "creative") {
        inventory.scroll(scrollDelta > 0 ? 1 : -1);
        return;
    }

    if (!player.controls.enabled || player.mode == "spectator" || player.mode == "camera") return;

    if (map[16]) e.preventDefault();

    let scrollDirection = game.invertMouse ? -1 : 1;
    if (navigator.userAgent.includes("Safari") && map[16]) scrollDirection *= -1;

    if (camera.enableZoom) {
        if (scrollDelta * scrollDirection * -1 > 0) {
            zoomLevel = clamp(zoomLevel + 0.2, -10, 10);
        } else {
            zoomLevel = clamp(zoomLevel - 0.2, -10, 10);
        }
        camera.zoom = zoomLevel;
    } else {
        if (scrollDelta * scrollDirection > 0) {
            nextSlot();
        } else {
            prevSlot();
        }
    }
});

function nextSlot() {
    player.currentSlot += 1;
    if (player.currentSlot > 8) player.currentSlot = 0;
}

function prevSlot() {
    player.currentSlot -= 1;
    if (player.currentSlot < 0) player.currentSlot = 8;
}

// Blur & Focus
$(window).blur(function () {
    inScreen = false;
})

$(window).focus(function () {
    inScreen = true;
})
