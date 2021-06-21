module.exports = {
  schema: {
    type: 'object',
    allOf: [
      {
        properties: {
          name: { type: 'string', maxLength: 10 },
          tel: {
            type: 'string',
            pattern: '^\\d{9,10}$' // 電話含區碼 9～10位數
          },
          address: { type: 'string', maxLength: 30 },
          opening_hours: { type: 'string', format: 'time' },
          description: { type: 'string', maxLength: 280, minLength: 0 }
        },
        additionalProperties: false
      }
    ],
    errorMessage: {
      properties: {
        name: '名字長度需小於 10 個字',
        tel: '請輸入含區碼的電話號碼(不包含任何符號和空格，共 9 或 10 碼',
        address: '地址長度需小於 30 個字',
        opening_hours: '請輸入正確的時間格式(24小時制)',
        description: '餐廳碼描述最多 280 個字'
      }
    }
  }
}
