import { authUser } from "../constants";
export const createThreads = (messages) => {
     const threadsMap = {};

    // Group messages by sender and recipient pairs
    messages.forEach((message) => {
      const key =
       message.sender.id === authUser.user_id
          ? `${message.sender.id}-${message.recipient.id}`
          : `${message.recipient.id}-${message.sender.id}`;

      if (!threadsMap[key]) {
        threadsMap[key] = {
          id: key,
          recipient_id: message.sender.id === authUser.user_id ? message.recipient.id : message.sender.id,
          name:
           message.sender.id === authUser.user_id
              ? `${message.recipient.first_name} ${message.recipient.last_name}`
              : `${message.sender.first_name} ${message.sender.last_name}`,
          messages: [],
        };
      }

      threadsMap[key].messages.push({
        id: message.id,
        text: message.body,
        timestamp: message.timestamp,
        isSender:message.sender.id === authUser.user_id,
      });
    });

    // Convert threadsMap object to an array
    const threads = Object.values(threadsMap);

    // Sort threads by the latest message timestamp
    threads.forEach((thread) => {
      thread.messages.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    });

    //Sort Threads
    const sortedThreads = sortThreads(threads);


    return sortedThreads;
};

//Create a function to sort threads by the latest message timestamp
export const sortThreads = (threads) => {
  return threads.sort(
    (a, b) => new Date(b.messages[0].timestamp) - new Date(a.messages[0].timestamp)
  );
};

//Create a ffunction to paginate threads
export const paginateThreads = (threads, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return threads.slice(startIndex, startIndex + pageSize);
}
//Show a 

    // Old Sort thread funciton Version:
    // threads.sort((a, b) => {
    //   const latestMessageA = new Date(a.messages[0]?.timestamp || 0);
    //   const latestMessageB = new Date(b.messages[0]?.timestamp || 0);
    //   return latestMessageB - latestMessageA;
    // });