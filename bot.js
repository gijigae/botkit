/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
          \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
           \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit is has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });


    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Hello ' + user.name + '!!');
        } else {
            bot.reply(message,'Hello.');
        }
    });
});

controller.hears(['what is accommodate?'], 'direct_message, direct_mention, mention', function(bot, message){
    controller.storage.users.get(message.user, function(err, user){
        if (user){
            bot.reply(message, {
                text:"If a building or space can *accommodate* someone or something, it has enough room for them.\n",
                attachments:[
                    {
                        "fallback": "Required plain-text summary of the attachment.",

                        "color": "#36a64f",

                        //"pretext": "",

                        //"author_name": "The school was not big enough to accommodate all the children.\n"
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",

                        //"title": "Slack API Documentation",
                        //"title_link": "https://api.slack.com/",

                        text:"The school was not big enough to accommodate all the children.\n"

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //]
                    }

                ],
            });
        }else{
            bot.reply(message, 'I don\'t know yet!')
        }
    });

});

controller.hears(['what is accomplish?'], 'direct_message, direct_mention, mention', function(bot, message){
    controller.storage.users.get(message.user, function(err, user){
        if (user){
            bot.reply(message, {
                text:"If you *accomplish* something, you succeed in doing it.\n\n",
                attachments:[
                    {
                        "fallback": "If we'd all work together, I think we could accomplish our goal.",

                        "color": "#36a64f",

                        //"pretext": "",

                        //"author_name": "The school was not big enough to accommodate all the children.\n"
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",

                        //"title": "Slack API Documentation",
                        //"title_link": "https://api.slack.com/",

                        text:"If we'd all work together, I think we could accomplish our goal.\n",

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //]
                        "image_url": "https://s3-ap-southeast-1.amazonaws.com/gijigae/accomplish.jpg"
                        //"thumb_url": "http://lorempixel.com/48/48"
                    }

                ],
            });
        }else{
            bot.reply(message, 'I don\'t know yet!')
        }
    });

});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['thank you'],'direct_message,direct_mention,mention',function(bot, message) {
    //var matches = message.text.match(/call me (.*)/i);
    //var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        //user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Don\'t mention it.');
        });
    });
});

controller.hears(['ok'],'direct_message,direct_mention,mention',function(bot, message) {
    //var matches = message.text.match(/call me (.*)/i);
    //var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        //user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Sorry about that');
        });
    });
});

controller.hears(['that is fine'],'direct_message,direct_mention,mention',function(bot, message) {
    //var matches = message.text.match(/call me (.*)/i);
    //var name = matches[1];
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'thumbsup',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        //user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'thank you for your understanding!');
        });
    });
});

controller.hears(['can you tweet it for me?'],'direct_message,direct_mention,mention',function(bot, message) {
    //var matches = message.text.match(/call me (.*)/i);
    //var name = matches[1];

    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        //user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'I haven\'t learned how to tweet yet');
        });
    });
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Your name is ' + user.name);
        } else {
            bot.reply(message,'I don\'t know yet!');
        }
    });
});


controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {
        convo.ask('Are you sure you want me to shutdown?',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say(message, {
                        text:"Q1. Provided the TOEICkers respond to the new service ______, " +
                        "ETS will probably allow it to continue.\n",
                        attachments:[
                            {
                                text:"\n(A) favorite \n(B) favorable\n(C) favor\n(D) favorably"
                            }

                        ]
                    });
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});

controller.hears(['part5'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {
        convo.ask('*Q1.* Provided the TOEICkers respond to the new service ______, ' +
            'ETS will probably allow it to continue.\n\n ' +
            '(A) favorite \n' +
            '(B) favorable\n' +
            '(C) favor\n' +
            '(D) favorably',[
            {
                pattern: "A",
                callback: function(response, convo) {
                    convo.say('Yes, answer is ' + response.text);
                    convo.next();
                    //setTimeout(function() {
                    //    process.exit();
                    //},3000);
                }
            },
            {
                pattern: "D",
                default: true,
                callback: function(response, convo) {
                    convo.say('Very good. Yes, ' + response.text + " is the correct answer.");
                    convo.next();
                }
            }
        ]);
    });
});

//
//controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {
//
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    },function(err, res) {
//        if (err) {
//            bot.botkit.log('Failed to add emoji reaction :(',err);
//        }
//    });
//
//
//    controller.storage.users.get(message.user,function(err, user) {
//        if (user && user.name) {
//            bot.reply(message,'Hello ' + user.name + '!!');
//        } else {
//            bot.reply(message,'Hello.');
//        }
//    });
//});

controller.hears(['part5-2'], 'direct_message, direct_mention, mention', function(bot, message){

    controller.storage.users.get(message.user, function(err, user){
        if (user){
            bot.reply(message, {
                text:"Q1. Provided the TOEICkers respond to the new service ______, " +
                    "ETS will probably allow it to continue.\n",
                attachments:[
                    {
                        text:"\n(A) favorite \n(B) favorable\n(C) favor\n(D) favorably"
                    }

                ],
            });
        }else{
            bot.reply(message, 'I don\'t know yet!')
        }
    });

});

controller.hears(['part6'], 'direct_message, direct_mention, mention', function(bot, message){

    controller.storage.users.get(message.user, function(err, user){
        if (user){
            bot.reply(message, {
                "text": "LONDON, 2 November - Dixon Dairy Prodcts Ltd. announced today that it will sepnd nearly " +
                    "£1.5 million to improve the then inspection rooms at its facility in Slough. The company will " +
                    "install new storage tanks and state-of-the-art equipment to regulate temperature. " +
                    "The ------- is expected ",
                "username": "Part6",
                "attachments": [
                    {
                        //"fallback": "Required plain-text summary of the attachment.",
                        //
                        //"color": "#36a64f",

                        "pretext": "150.",

                        //"author_name": "Test",
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",
                        //
                        //"title": "Slack API Documentation",
                        //"title_link": "https://api.slack.com/",

                        text:"(A) relocation \n" +
                        "(B) upgrade\n" +
                        "(C) transfer\n" +
                        "(D) merger"

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //],
                        //
                        //"image_url": "https://s3-ap-southeast-1.amazonaws.com/gijigae/toeic-part7.jpg"
                        //"thumb_url": "http://lorempixel.com/48/48"
                    }
                ],
                "icon_url": "http://lorempixel.com/48/48"
            });
            bot.reply(message, {
                "text": "to increase the company's dairy production by at least 20 percent over the next three years.\n\n " +
                "The plans are motivated by increased demand for Dixon products in several markets. In addition to " +
                "the Slough facility. Dixon has a smaller production plant in Cardiff, Wales, where a similar project " +
                "commenced early last year. The work at Cardiff ------- within seven months.",
                "username": "Part6",
                "attachments": [
                    {
                        //"fallback": "Required plain-text summary of the attachment.",
                        //
                        //"color": "#36a64f",

                        "pretext": "151.",

                        //"author_name": "Test",
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",
                        //
                        //"title": "Slack API Documentation",
                        //"title_link": "https://api.slack.com/",

                        text:"(A) has been completed \n" +
                        "(B) will be completed\n" +
                        "(C) was completed\n" +
                        "(D) will have been completed"

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //],
                        //
                        //"image_url": "http://www.planwallpaper.com/static/images/wallpapers-hd-8000-8331-hd-wallpapers.jpg",
                        //"thumb_url": "http://lorempixel.com/48/48"
                    }
                ],
                "icon_url": "http://lorempixel.com/48/48"
            });
            bot.reply(message, {
                "text": "Since then, the company's dairy production has risen by roughly 4 percent.\n\n " +
                "Dixon is regarded as the premier producer of cheese and yogurt in the region and has enjoyed " +
                "considerable sales in recent years. Last year the company's cheese sales ------- exceeded £40 " +
                "million.",
                "username": "Part6",
                "attachments": [
                    {
                        //"fallback": "Required plain-text summary of the attachment.",
                        //
                        //"color": "#36a64f",

                        "pretext": "152.",

                        //"author_name": "Test",
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",
                        //
                        //"title": "Slack API Documentation",
                        //"title_link": "https://api.slack.com/",

                        text:"(A) alone \n" +
                        "(B) apart\n" +
                        "(C) above\n" +
                        "(D) around"

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //],
                        //
                        //"image_url": "http://www.planwallpaper.com/static/images/wallpapers-hd-8000-8331-hd-wallpapers.jpg",
                        //"thumb_url": "http://lorempixel.com/48/48"
                    }
                ],
                "icon_url": "http://lorempixel.com/48/48"
            });
        }else{
            bot.reply(message, 'I don\'t know yet!')
        }
    });

});

controller.hears(['part7 sp'], 'direct_message, direct_mention, mention', function(bot, message){

    controller.storage.users.get(message.user, function(err, user){
        if (user){
            bot.reply(message, {
                "text": "*Questions 157 - 159* refer to teh following billing statement.",
                "username": "Part7 SP",
                "attachments": [
                    {
                        "fallback": "Billing statement for the questions 157 - 159.",

                        "color": "#36a64f",

                        //"pretext": "Desparte Systems",
                        //
                        //"author_name": "Test",
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",
                        //
                        //"title": "Billing Statement",
                        //"title_link": "https://s3-ap-southeast-1.amazonaws.com/gijigae/toeic-part7.jpg",

                        text:"Billing Statement" ,

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //],
                        //
                        "image_url": "https://s3-ap-southeast-1.amazonaws.com/gijigae/toeic-part7-v3.jpg"
                        //"thumb_url": "http://lorempixel.com/48/48"
                    }
                ],
                "icon_url": "http://lorempixel.com/48/48"
            });
            bot.reply(message, {
                "text": "For what service was the bill issued?",
                "username": "Part7 SP",
                "attachments": [
                    {
                        //"fallback": "Required plain-text summary of the attachment.",
                        //
                        //"color": "#36a64f",

                        "pretext": "152.",

                        //"author_name": "Test",
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",
                        //
                        //"title": "Slack API Documentation",
                        //"title_link": "https://api.slack.com/",

                        text:"(A) Property maintenance \n" +
                        "(B) Electricity\n" +
                        "(C) Heating oil\n" +
                        "(D) Water"

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //],
                        //
                        //"image_url": "http://www.planwallpaper.com/static/images/wallpapers-hd-8000-8331-hd-wallpapers.jpg",
                        //"thumb_url": "http://lorempixel.com/48/48"
                    }
                ],
                "icon_url": "http://lorempixel.com/48/48"
            });
        }else{
            bot.reply(message, 'I don\'t know yet!')
        }
    });

});

controller.hears(['part7 dp'], 'direct_message, direct_mention, mention', function(bot, message){

    controller.storage.users.get(message.user, function(err, user){
        if (user){
            bot.reply(message, {
                "text": "*Desparte Systems to Open New Data Centers*\n" +
                    "by Cheryl Wittenauer\n\n" +
                    "MONTREAL - Desparte Systems, a diversified manufacturing and " +
                    "distributing company, has announced plans to build a " +
                    "2,800-square-meter data center in Montreal as part of its " +
                    "effort to reorganize its global business operations. " +
                    "In addition, other data centers will be built in Dallas, " +
                    "Brussels, and Bangalore. Currently, Desparte's two largest " +
                    "data centers are in London and Chicago, in facilities owned by " +
                    "other companies. Desparte plans to close smaller centers in Seattle and Mumbai.\n\n" +
                    "Desparte vice president for operations Elena Fontaine said the changes will enhance " +
                    "business efficiency and improve productivity. She stressed that Desparte personnel "+
                    "will face minimal job loss as a result of the changes because the data centers, " +
                    "which are essentially large rooms employ relatively few people. Fontaine said " +
                    "that the new centers will be more secure and also more energy-efficient. The " +
                    "transition is expected to take place over the next two years.\n\n" +
                    "The new Montreal site will serve as the central location for the company's " +
                    "operations. The Montreal and Dallas centers will be built first at a combined " +
                    "cost of approximately C$35 million. The company will lease a facility in Montreal " +
                    "next year while construction of the permanent center takes place.\n\n" +
                    "-------------------------------------------------------\n\n" +
                    "*Desparte Systems*\n\n" +
                    "December 2\n\n" +
                    "Simon Stevens, Editor\n" +
                    "_Global Business Magazine_\n" +
                    "1500 Weston Ave." +
                    "Dallas, TX 75208\n\n" +
                    "Dear Mr. Stevens:\n\n" +
                    "I am writing in regard to Cheryl Wittenauer's article on Desparte Systems in the " +
                    "November 30 issue of _Global Business Magazine_. While I appreciate the coverage we " +
                    "received by your magazine, I want to call your attention to a few inaccuracies. First, " +
                    "we will only be closing one of our active data centers. The Mumbai center will remain open " +
                    "and will focus on running quality-control checks. Second, the centers in Montreal and " +
                    "Bangalore will be built first; the site in Dallas has not yet been officially scheduled " +
                    "for construction.\n\n" +
                    "I would appreciate it if you would print these corrections in an upcoming issue of your " +
                    "magazine. If you have any questions, please call me directly at 450-555-0054.\n\n" +
                    "Sincerely,\n\n" +
                    "Martin Gervais, Directory of Public Relations\n" +
                    "Desparte Systems\n\n" +
                    "-------------------------------------------------------\n\n" +
                    "001. What does the article imply about Desparte Systems?\n",
                "username": "Part7",
                "attachments": [
                    {
                        //"fallback": "Required plain-text summary of the attachment.",
                        //
                        //"color": "#36a64f",
                        //
                        //"pretext": "Desparte Systems",
                        //
                        //"author_name": "Test",
                        //"author_link": "http://flickr.com/bobby/",
                        //"author_icon": "http://flickr.com/icons/bobby.jpg",
                        //
                        //"title": "Slack API Documentation",
                        //"title_link": "https://api.slack.com/",

                        text:"(A) It plans to borrow money. \n" +
                            "(B) It will retain most of its employees.\n" +
                            "(C) It is reorganizing its marketing department.\n" +
                            "(D) It will merge with another company."

                        //"fields": [
                        //    {
                        //        "title": "Test",
                        //        "value": "High",
                        //        "short": false
                        //    }
                        //],
                        //
                        //"image_url": "http://lorempixel.com/48/48",
                        //"thumb_url": "http://lorempixel.com/48/48"
                    }
                ],
                "icon_url": "http://lorempixel.com/48/48"
            });
        }else{
            bot.reply(message, 'I don\'t know yet!')
        }
    });

});

controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
