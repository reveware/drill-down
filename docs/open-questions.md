**What is drill-down?**
Is a web application, that bridges between social media behavior (posting  & hash-tagging) and a 3D world built over a public ledger (blockchain).

**What's drill-down for?**
drill-down is for record keeping experiences. Users can use tag-threading to backtrack their own posts, as well as their friends.

They also will get unique non-fungible collectibles (Assets) as incentive for interacting with the network. 

**How does drill-down work?**

Users can create post in order to build their blog-like profile, while doing so, the system generates unique `Assets` for them, either by extracting information from said posts via image recognition, or simply using tags to creating an overall `THEME` for that user, and those themes are mapped to either pre-built 3D renders, or to 3D prop objects that can be used to set up a `SCENE`.

Users will be able to visit another user's `SCENE` (based on privacy preferences), by visiting their profile and seeing their `ROOM`.

Generated Assets are available for review in an "inventory" kind-of feature, where users might be able to trade them. 

In order to build enough context about the user to be able to generate assets for them, "Surveys" will have to be made to them, in order to get to know their preference and taste. 

For example, at the moment of registering, the App might ask them if they like Movies, Music, Sports, or Books, and then dive deeper into details.

A Chatbot will be used to carry these surveys after registration, on specific times, like after posting, if no relevant information was able to be extracted from the post. 

Scheduled jobs will then run for each user, in order to generate a work queue, to either find or generate assets based on their context, and build the SCENE on WebGL so that the frontend can render it. and finally send a message to the user that their Capsule is ready.


**Who uses drill-down?**
Anyone who enjoys maintaining an online souvenir-like history.

**What functionalities has drill-down?**
With drill-down you can:
 - Upload Photo posts and tag them.
 - Upload Quote posts and tag them.
 - Having friends and interacting with them.
 - Send time-locked messages to friends.
 - Rendering image sequence.
 - Rendering webgl interactive (but pre-made) FPS/TPS mini-games. 
 - Rendering canvas interactive mini-games.


**What are the main entities in drill-down?**
The main principals in drill-down are:
 - Users
 - Posts
 - Messages (aka Capsules)
 - Assets
 - Scenes
 - Triggers
