const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool;
if (process.env.NODE_ENV === 'production') {
	// On production server using heroku db connection string
	pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'test') {
	pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
} else {
	// created a Pool using local env default config on local
	pool = new Pool({ connectionString: process.env.DEV_DATABASE_URL });
}

module.exports ={
	query: async (text, params) => {
		const client = await pool.connect();
		try {
			const res = await client.query(text, params);
			return res;
		} finally {
			client.release();
		}
	},
	clearDb: async () => {
		const client = await pool.connect();
		await client.query('DROP TABLE IF EXISTS users, gifs, articles CASCADE');
	}
};


// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// module.exports = {
//   /**
//    * DB Query
//    * @param {string} text
//    * @param {Array} params
//    * @returns {object} object 
//    */
//   query(text, params){
//     return new Promise((resolve, reject) => {
//       pool.query(text, params)
//     //   .then((res) => {
//     //     resolve(res);
//     //   })
//     //   .catch((err) => {
//     //     reject(err);
//     //   })
//     })
//   }
// }