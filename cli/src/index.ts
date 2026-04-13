import { Command } from 'commander';

const program = new Command();

program
  .name('aiad')
  .description('AIAD Studio CLI')
  .version('0.1.0');

program.parse();
