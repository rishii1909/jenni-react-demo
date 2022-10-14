# Jenni.ai README

### Solution demo loom :
https://www.loom.com/share/3171af94234e4aa5ae274c8393230a8c

### Code walkthrough loom :
https://www.loom.com/share/5879bac3e9ea460a91c29ebd81cdff61

## Provide an overview of how to build and run your app.

Just run `npm install && npm start` on both Node.js server and the react application.

## A brief explanation of your architecture and system design.

The Node.js server holds the document in-memory. It solely serves as a websocket server facilitating syncronization of updates between multiple clients. 

The React app possesses a quill text editor, and sends updates performed by the local user to the Node server. The Node server merges the changes with the original document, and broadcasts the updates to all other clients.

## A brief explanation of how conflict resolution is handled. You may comment on the tradeoffs of your strategy and any areas where it can be improved.

Conflicts are handled by ensuring the following workflow is strictly followed for all users : 

 - Local's users updates are applied first, and changes are relayed on after that to reflect in all other clients.
 - Updates are performed dynamically. Rather than over-writing content, the logic can be considered somewhat similar to adding and removing nodes from a doubly-linked list. This helps us to ensure insert/delete operations are non-destructive to content present before/after the target index.
 - Tradeoffs - possible overhead runtime complexity to propagate changes in cases of large bulk updates, such as pasting 3 pages worth of content and deleting it. As of now though, it's on par with time taken for such operations by Google docs. That being said, we can't be certain that it would say the same when scaled exponentially. Also, a big advantage it currently has is using an in-memory storage which cuts down edit times for the document by a lot. This is a bad practice, only good enough for making a demo out of an MVP. Typically considering persistent storage is desired, it's ideal to make use of redis to perform fast read/write operations, with slightly longer load times.



## Are there any cool technology/libraries/algorithms you want to explore further related to this app if you had the time? Are there any burning questions you have about the technology?

Yes! As mentioned in the Loom video, I'd love to get into creating our own implementation of CRDT (Conflict-free Replicated Data Type) architecture for real-time document collaboration in jenni.ai. From what I've read it has many benefits but it does have a few drawbacks too, such as it's inability to recover quickly from a collision between two clients, or allow for fancy content such as image, embed links etc. I feel we can create effective workarounds for such caveats and have a good secure collaboration service. Adding a public/private keypair to each user's account, using basic auth. We can also try WebAuthN for seamless and reliable security, but I believe that might be an overkill for our current use case.





 
