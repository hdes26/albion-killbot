const ChannelTypes = [
  {
    name: 'Kill',
    value: 'kill',
  },
  {
    name: 'Death',
    value: 'death',
  },
];

const commands = [
  {
    name: 'killboard',
    description: 'Install Guild Kill Registration',
    options: [
      {
        type: 3,
        name: 'guild',
        description: 'Guild name',
        required: true,
      },
    ],
  },
  {
    name: 'set',
    description: 'Install Channel Kill Registration',
    options: [
      {
        type: 3,
        name: 'type',
        description: 'Channel type',
        required: true,
        choices: ChannelTypes
      },
    ],
  }
];

module.exports = { commands };
