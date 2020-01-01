# Sample project

Open this sample project in a terminal:

- `cd server`
  - `npm install`
  - `npx prisma login`
  - `npx prisma deploy`
    - Use a demo server from prisma.io
  - `npm run start`
- `cd ..` and `cd server`
  - `npm install`
  - `npm run codegen`
  - `npm run start`

# Prisma Tutorial

Commands inside `backticks` are run in a terminal.

The recommended code editor is vscode. The `GraphQL`, `Prisma`, and `Apollo GraphQL` plugins are helpful.

## Prisma Setup

Create a folder for your project.

- `mkdir project-name`

Navigate inside the project folder.

- `cd project-name`

Create a nested folder called `server`.

- `mkdir server`

Navigate inside the server folder.

- `cd server`

Create a nested folder called `prisma`.

- `mkdir prisma`

Navigate inside the prisma folder.

- `cd prisma`

The folder structure should look like:

- project-name
  - server
    - prisma

Login to prisma.io, or create an account.

- `npx prisma login`

Run the init command to scaffold out the project.

- `npx prisma init`

Choose options similar to the ones below.

```
? Set up a new Prisma server or deploy to an existing server?
  Demo server + MySQL database
? Choose the region of your demo server
  demo-us1
? Choose a name for your service
  project-name-server
? Choose a name for your stage
  dev
? Select the programming language for the generated Prisma client
  Prisma TypeScript Client
```

Open the `project-name` folder in vs-code

Open and edit the `prisma.yml`

```yml
# Old data model
datamodel: datamodel.prisma
# New data model
# Be sure to rename the datamodel.prisma file to datamodel.graphql
datamodel: datamodel.graphql
```

```yml
# Old file path
generate:
  - generator: typescript-client
    output: ./generated/prisma-client/
# New file path
generate:
  - generator: typescript-client
    output: ../generated/prisma-client/
```

```yml
# Add hook for nexus-prisma
hooks:
  post-deploy:
    - npx prisma generate
    - npx nexus-prisma-generate --client ./generated/prisma-client --output ./generated/nexus-prisma
```

### Seed

If time allows, add a seed command.

Create a new folder inside `server` called `seed` with a file called `index.ts`. Import the prisma client.

```ts
import { prisma } from '../generated/prisma-client';
```

Add the `seed` property to your `prisma.yml`

```yml
# Seeds initial data into the database by running a script.
seed:
  run: npx ts-node-dev --no-notify --transpileOnly ./seed/index
```

### Deploy

Run `npx prisma deploy`

Your `prisma.yml` file should look like this:

```yml
# File paths are relative to project root folder

# Specifies the HTTP endpoint of your Prisma API.
endpoint: https://us1.prisma.sh/john-armstrong/project-name-server/dev

# Defines your models, each model is mapped to the database as a table.
datamodel: datamodel.prisma

# Specifies the language and directory for the generated Prisma client.
generate:
  - generator: typescript-client
    output: ../generated/prisma-client/

# Ensures Prisma client is re-generated after a datamodel change.
hooks:
  post-deploy:
    - npx prisma generate
    - npx nexus-prisma-generate --client ./generated/prisma-client --output ./generated/nexus-prisma

# Seeds initial data into the database by running a script.
seed:
  run: npx ts-node-dev --no-notify --transpileOnly ./seed/index
```

Check out the prisma docs for more information on [prisma models](https://www.prisma.io/docs/datamodel-and-migrations/datamodel-MYSQL-knul/) and the [prisma cli](https://www.prisma.io/docs/prisma-cli-and-configuration/using-the-prisma-cli-alx4/)

## JavaScript / TypeScript Setup

Initialize a new JavaScript project inside the server folder. This command creates a `package.json` to track the libraries your project depends on.

- `npm init`

Choose options similar to the ones below.

```
package name: project-name-server
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC) or UNLICENSED

Is this OK? (yes)
```

Install the Typescript packages you need to compile TypeScript to JavaScript. The `-D` flag tags the packages as developer dependencies.

- `npm install -D typescript ts-node-dev`

In the `server` folder, create a `tsconfig.json` with the following settings:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "lib": ["esnext", "dom"],
    // "strict": true, // `strict` is commented because of this issue: https://github.com/prisma/prisma/issues/3774; all its options except `strictNullChecks` & `strictPropertyInitialization` are explicitly set below.
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "strictBindCallApply": true,
    "strictFunctionTypes": true,
    "allowJs": true
  }
}
```

Notice the `allowJs` key. This setting allows us to write JavaScript in TypeScript files with all the same autocomplete benefits.

<!--
Possible TypeScript Error, but seems to be fixed
// "skipLibCheck": true // `skipLibCheck` is enabled until this is issue is fixed: https://github.com/prisma/nexus-prisma/issues/82
 -->

## Git

The installed packages are being parsed by vscode for intellisense, which is unnecessary. Tell vscode to ignore them with a `.gitignore` file in the `server` folder.

`touch .gitignore`

Go to [gitignore.io](http://gitignore.io/) and add `Node`, `macOS`, `Linux`, and `Windows`.

Click create.

<!--
For the React.js portion
Copy the generated text. Search for `dotenv environment variables file` section and comment the lines out.
-->

Open the `.gitignore` file in vscode.

Paste the copied text. Optionally, add `./generated` and files in your `./seed` folder on new lines at the top of the file.

Optionally, initialize the git repository outside the `server` folder but inside your project folder with `git init`. Create another `.gitignore` file from [gitignore.io](https://www.gitignore.io/api/node,linux,macos,windows)

`git add -A`

`git status`

`git commit -m "feat: initial commit"`

Go to [GitHub](https://github.com/new) and create a new project.

Name your repository. Click create repository.

Choose the second option and copy and paste the code under `…or push an existing repository from the command line` into the terminal.

Continually commit your work as you go through this tutorial.

## Setup Nexus

Install the dependencies for the server. Please note the nexus and nexus-prisma version numbers.

- `npm install nexus@0.11 nexus-prisma@0.3 graphql prisma-client-lib apollo-server`

Create a folder for the server source code.

- `mkdir src`

Navigate inside the `src` folder.

- `cd src`

Create three files inside the `src` folder.

- `touch index.ts server.ts schema.ts`

Create a folder named `typescript` inside of the `src` folder.

- `mkdir typescript`

Navigate into the `typescript folder`

- `cd typescript`

Create a `index.ts` file

- `touch index.ts`

The folder structure should look like:

- project-name
  - server
    - prisma
      - datamodel.graphql
      - prisma.yml
    - seed (optional)
      - index.ts
    - src
      - typescript
        - index.ts
      - schema.ts
      - server.ts
      - index.ts
    - .gitignore
    - tsconfig.json
    - package.json
    - package-lock.json

Add this boilerplate code to the types.ts file. This file will help vscode intellisense autocomplete our code.

`src/typescript/index.ts`

```ts
import { Prisma } from '../../generated/prisma-client';

export interface Context {
  prisma: Prisma;
}
```

Add this boilerplate code to the schema.ts file. Note that we have not created the `./types/index.ts` file yet.

`src/schema.ts`

```ts
import { makePrismaSchema } from 'nexus-prisma';
import * as path from 'path';
import datamodelInfo from '../generated/nexus-prisma';
import { prisma } from '../generated/prisma-client';
import types from './types/index';

const schema = makePrismaSchema({
  // Provide all the GraphQL types we've implemented
  types,

  // Configure the interface to Prisma
  prisma: {
    datamodelInfo,
    client: prisma,
  },

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.ts'),
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: false,
    output: false,
  },

  // Configure automatic type resolution for the TS representations of the associated types
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './typescript/index.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
});

export default schema;
```

Create and export the Apollo Server with schema generated from makePrismaSchema.

`src/server.ts`

```ts
import { ApolloServer } from 'apollo-server';
import { prisma } from '../generated/prisma-client';
import schema from './schema';

const server = new ApolloServer({
  schema,
  context: { prisma },
});

export default server;
```

`src/index.ts`

```ts
import server from './server';

server.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`),
);
```

## Nexus Types

In the `src` folder, create a new folder called `types` with the files `index.ts Query.ts Mutation.ts User.ts` inside.

Create and export the top-level Query type.

`Query.ts`

```ts
import { prismaObjectType } from 'nexus-prisma';

const Query = prismaObjectType({
  name: 'Query',
  definition: t => t.prismaFields(['*']),
});

export default Query;
```

Create and export the top-level Mutation type.

`Mutation.ts`

```ts
import { prismaObjectType } from 'nexus-prisma';

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => t.prismaFields(['*']),
});

export default Mutation;
```

Create and export the custom User type.

`User.ts`

```ts
import { prismaObjectType } from 'nexus-prisma';

const User = prismaObjectType({
  name: 'User',
  description: 'A generic user example',
  definition(t) {
    t.prismaFields(['*']);
  },
});

export default User;
```

Import all the individual types, and export them as an array for makePrismaSchema.

`index.ts`

```ts
import Query from './Query';
import Mutation from './Mutation';
import User from './User';

const types = [Query, Mutation, User];

export default types;
```

Visit the [nexus-prisma](https://github.com/prisma-labs/nexus/blob/8cf2d6b3e22a9dec1f7c23f384bf33b7be5a25cc/docs/database-access-with-prisma.md#examples-1) docs to learn more about revealing and hiding generated queries, mutations, and fields. Try filtering the mutation type.

Try the filtering out in the Mutation type.

```js
const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t =>
    t.prismaFields({ filter: ['deleteManyUsers', 'updateManyUsers'] }),
});
```

## package.json

Add scripts to your `package.json` to make development easier.

```json
{
  "scripts": {
    "prisma": "npx prisma deploy",
    "start": "ts-node-dev --no-notify --respawn --transpileOnly ./src",
    "seed": "npx prisma seed"
  }
}
```

Run `npm start` and hope that everything works!

# React Tutorial

Commands inside `backticks` are run in a terminal.

## React Setup

Inside your project folder, use create-react-app to scaffold out a react project next to your server folder. We will name the react app `client`.

- `npx create-react-app client`

To start from scratch, delete and recreate the `src` folder inside `client`.

### tsconfig.json

Inside `client`, create a tsconfig.json file with the following boilerplate code:

`jsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": ["src"]
}
```

The `tsconfig.json` file will allow us to use JavaScript within TypeScript with all of TypeScript’s autocomplete benefits. In addition, the config will allow us to import components with absolute imports from `src` instead of relative imports with `./`.

Install typescript as a developer dependency with `npm install -D typescript`

The first time you run `npm start` with typescript, a file called `react-app-env.d.ts` will be created inside `src` with the following code:

```ts
/// <reference types="react-scripts" />
```

### .graphqlconfig

Optionally, create a .graphqlconfig for vscode plugin support. The server must be running from the terminal to use the plugin as well.

```json
{
  "schemaPath": "../server/generated/schema.graphql",
  "extensions": {
    "endpoints": {
      "dev": {
        "url": "http://localhost:4000"
      }
    }
  }
}
```

### .gitignore

Add the same code from the `.gitignore` in the `server` folder to the bottom of the `.gitignore` file in `client`. However, instead of `/generated`, use `/src/generated`.

For reference, use [gitignore.io](https://www.gitignore.io/api/node,linux,macos,windows)

Also, delete the hidden `.git` folder inside `client`, as it will conflict with the `project-name` repository.

### App.js

Inside the new `src` folder, create a folder called `components` with a nested folder called `App` with `App.js` inside. Create and export a functional component to render `Hello World` to the browser.

`App.js`

```jsx
import React from 'react';

const App = () => {
  return <div>Hello World</div>;
};

export default App;
```

### index.js

Create a new `index.js` inside the `src` folder. Write the boilerplate code to render react in the browser.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App/App';

const root = <App />;

ReactDOM.render(root, document.getElementById('root'));
```

Make sure everything works by running `npm start` without errors.

## GraphQL

### Apollo Client

Install the apollo-client and other dependencies by running `npm install apollo-boost graphql react-apollo`

Create the ApolloClient and wrap your <App /> component with the <ApolloProvider> inside `index.js`.

Your `index.js` should look like:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App/App';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

const root = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(root, document.getElementById('root'));
```

### GraphQL Queries and Mutations

Inside `src`, create a folder called `graphql` containing the two files `mutations.js` and `queries.js`.

Inside the `queries.js` file, write and export a query with graphql-tag to fetch all users. The query is the same from the graphql playground on the server.

```jsx
import gql from 'graphql-tag';

export const USERS = gql`
  query users {
    users {
      id
      name
    }
  }
`;
```

Inside the `mutations.js` file. Write and export a mutation to create a new user as well as a mutation to delete a new user. The mutation is the same from the graphql playground on the server.

```jsx
import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      name
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($where: UserWhereUniqueInput!) {
    deleteUser(where: $where) {
      id
      name
    }
  }
`;
```

Note that all queries and mutations must be named.

### Generate GraphQL Components

Create a `codegen.yml` with the following boilerplate code:

```yml
overwrite: true
schema: 'http://localhost:4000'
documents: './src/graphql/**/*.{ts,tsx,js,jsx}'
generates:
  src/generated/apollo-components.tsx:
    plugins:
      - 'typescript'
      - 'typescript-operations'
      - 'typescript-react-apollo'
    config:
      withHooks: true
```

Add `graphql-codegen` as a developer dependency by running `npm install -D @graphql-codegen/cli @graphql-codegen/core @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo`.

Update your `package.json` with a script to automatically generate your files. Then, run `npm run codegen`.

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "codegen": "graphql-codegen --watch"
  }
}
```

### Make your own components

Customize the `App.js` file to fetch all users and a way to create additional users. A short crud example is below:

```jsx
import React from 'react';
import {
  useUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} from 'generated/apollo-components';

const User = ({ id, name }) => {
  const [deleteUserMutation] = useDeleteUserMutation({
    variables: {
      where: {
        id,
      },
    },
    refetchQueries: ['users'],
  });

  return (
    <div>
      Id: {id}
      <br />
      Name: {name}
      <br />
      <button onClick={deleteUserMutation}>X</button>
    </div>
  );
};

const Users = () => {
  const { data, loading, error } = useUsersQuery();
  // console.log(data)
  // <pre>{JSON.stringify(data, null, 2)}</pre>;
  if (loading) {
    return 'Loading…';
  }
  if (error) {
    return 'Error…';
  }
  return data.users.map(({ id, name }) => (
    <User key={id} id={id} name={name} />
  ));
};

const CreateUser = () => {
  const [name, setName] = React.useState('');

  const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
    variables: {
      data: {
        name,
      },
    },
    refetchQueries: ['users'],
  });

  return (
    <form>
      <label htmlFor="name-input">Name: </label>
      <input
        id="name-input"
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <button onClick={createUserMutation}>Add User</button>
    </form>
  );
};

const App = () => {
  return (
    <div>
      <Users />
      <CreateUser />
    </div>
  );
};

export default App;
```
