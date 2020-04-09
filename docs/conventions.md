# Coding Conventions

## Branches

Use git-flow to manage branches. To name branches:

- Use prefixes related to type of work: hotfix/, feature/, release/, support/
- each feature starts with pivotal story ID: `feature/424242-name-of-feature`
- Use lower case
- Use '-' to separate words

## Naming

Classes should always start with an uppercase (ex: `MyClasse`).

Variables and fonctions should be camel-cased and start with a lowercase (ex: `myFonction`, `myVar`);

Please take time to name your functions and vars with explicit names.

## Importing

Imports should be im this order, seperated by en empty line:

1. External packages (axios, pcap, etc...)
2. Local modules (import Module from './Module')
3. Local functions (import {Function} from './Module')

Example: 
```js
import axios from 'axios';
import fs from 'fs';

import Module from './Module';

import { myFunc } from './OtherModule';
```