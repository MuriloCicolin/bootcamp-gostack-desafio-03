module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  //  port: 5433,
  username: 'postgres',
  password: 'docker',
  // password: 'mrlc2312',
  database: 'fastfeet',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
