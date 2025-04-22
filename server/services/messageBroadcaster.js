const clients = new Map(); // userId -> array of response objects

function addClient(userId, res) {
  if (!clients.has(userId)) clients.set(userId, []);
  clients.get(userId).push(res);

  res.on('close', () => {
    removeClient(userId, res);
  });
}

function removeClient(userId, res) {
  const list = clients.get(userId);
  if (!list) return;

  const index = list.indexOf(res);
  if (index !== -1) list.splice(index, 1);

  if (list.length === 0) clients.delete(userId);
}

function broadcast(message) {
  for (const [, connections] of clients) {
    connections.forEach(res => {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }
}

function getOnlineUserIds() {
  return Array.from(clients.keys());
}

module.exports = { addClient, removeClient, broadcast, getOnlineUserIds };
