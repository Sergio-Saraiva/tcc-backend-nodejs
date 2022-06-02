web: node ./src/server.js
release: npx sequelize-cli db:migrate --debug && npx sequelize-cli db:seed:undo:all --debug && npx sequelize-cli db:seed:all --debug
