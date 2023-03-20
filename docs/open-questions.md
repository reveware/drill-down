
# Open Questions

### What is drill-down?
Is a web application, that bridges between social media behavior (posting & hash-tagging) and a 3D world built over a public ledger (blockchain).

  

### What's drill-down for?

drill-down is for record keeping memories. Users can use tag-threading to backtrack their own posts, as well as their friends.
  

They also will get unique non-fungible collectibles (Assets) as incentive for interacting with the network.

  

### How does drill-down work?

**Posting and Building Scenes**
Users can create post in order to build their blog-like profile, while doing so, the system generates unique `Assets` for them, either by extracting information from said posts via image recognition, post-publishing surveys, or simply using tags to create an overall `THEME` for that user, and those themes are mapped to either pre-built 3D renders, or to 3D "rooms" from a live server of an online POV shooter world, filled with prop objects based on those themes.

Users will be able to visit another user's `SCENE` (based on privacy preferences), by visiting their profile and seeing their `ROOM`. If privacy preference allow it, the room is also available for "time-travelling" by any other user. 

Generated Assets are available for review in an "inventory" kind-of action, where users might be able to trade or sell them.
  
In order to build enough context about the user to be able to generate assets for them, `SURVEYS` will have to be made to them, in order to get to know their preference and taste. This will be done through a ChatBot like assistant, which is in-charge of populating JSON objects that describe the scene in the room.
 
These surveys can be made at different times, such as after registration,  after posting (if no relevant information was extracted from the post), or even at at random times

For example, at the moment of registering, the Chatbot might ask users if they prefere Movies, Music, Sports, or Books, and then dive deeper into details.  

Scheduled jobs will then run for each user, in order to generate a work queue, to either find or generate assets based on their context, and build the scene on WebGL using, so that the frontend can render it. These jobs also trigger notifications for users, letting them know a new Capsule is ready
 
  

### Who uses drill-down?
Anyone who enjoys maintaining an online souvenir-like history.
  

### What features does drill-down have?

With drill-down you can:

- Upload Photo posts and tag them.

- Upload Quote posts and tag them.

- Having friends and interacting with them. (likes, favorites)

- Send time-locked messages to users. (timebombs)

- Rendering image sequence. (as assets)

- Rendering webgl interactive (but pre-made) FPS/TPS mini-games. (as assets)

- Managing, selling and trading assets.

- Rendering canvas interactive mini-games.


  

**What are the main entities in drill-down?**

The main principals in drill-down are:

- Users

- Posts

- Messages (aka Capsules)

- Assets

- Scenes

- Triggers

