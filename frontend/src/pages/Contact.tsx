import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="page contact-page">
      <h1>Liên hệ</h1>
      <p>Thông tin liên hệ của chúng tôi.</p>
      <form>
        <div>
          <label htmlFor="name">Tên:</label>
          <input type="text" id="name" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" />
        </div>
        <div>
          <label htmlFor="message">Tin nhắn:</label>
          <textarea id="message"></textarea>
        </div>
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
};

export default Contact;