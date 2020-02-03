const mockController = {
  onEvent: console.log
};

const context = {
  controller: mockController,
  botName: undefined,
  decks: undefined,
  stats: undefined,
  error: undefined
};

export default context;
