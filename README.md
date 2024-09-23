# Syncronus Chat App

Welcome to **Syncronus Chat App**, a powerful and efficient messaging application that provides live chat, direct messaging, channel-based communication, file sharing, and robust user profile management. The app ensures real-time messaging with lightning-fast speed and minimal delay, built using modern technologies for an optimal user experience.

## Features

- **Live Chat**: Seamless real-time chat functionality with quick message delivery.
- **Live Status of Users**: Get real-time online/offline status of other users.
- **Direct Messaging**: Private one-on-one messaging for personal communication.
- **Channel Chat**: Create and manage chat channels for team or group conversations.
- **Profile Management**: Personalize and manage user profiles with the ability to update profile pictures, bios, and more.
- **File Sharing**: Effortlessly share files within chats.
- **Search Contacts**: Search for users and contacts easily with an intuitive search interface.
- **Responsive Design**: Fully responsive and optimized for both mobile and desktop devices.
- **User Authentication**: A secure user authentication system powered by JWT ensures safe access.
- **Delete Messages and Files**: Option to delete pictures and files messages for better control over conversations.
- **Channel Information**: View information about the channel's members and admin.
  
## Project Overview

### Frontend Technology

- **React with Vite**: The application’s frontend is built with React, offering a modular, component-based structure. Vite is the build tool, enabling fast and optimized development with minimal overhead. The interface is designed to be intuitive, responsive, and dynamic.
  
- **Zustand**: For efficient state management, Zustand manages user data, online status, messages, and UI states, offering a lean and scalable solution.
  
- **Shadcn-UI**: Styled components and UI elements from Shadcn-UI were utilized to build an aesthetically pleasing, modern, and accessible interface.

### Backend Technology

- **Node.js with Express**: The backend is powered by Node.js and Express, delivering a robust and scalable API to handle user authentication, messaging, and file uploads efficiently.
  
- **Socket.IO**: Socket.IO enables real-time, bi-directional communication between the frontend and backend, ensuring that messages, user statuses, and other events are synchronized in real-time.
  
- **MongoDB**: MongoDB serves as the database for the application, handling user data, chat logs, file metadata, and channel information in a flexible and scalable NoSQL format.

- **JWT Authentication**: JSON Web Token (JWT) is used to authenticate users and secure routes, ensuring that only authorized users can access protected endpoints.
  
- **Multer**: File handling for uploads is managed through Multer, allowing users to upload and share files securely and efficiently in the chat.
  

## Screenshots

Below are screenshots showcasing the key interfaces of the Syncronus Chat App:

1. **Main Chat Interface**

   ![Syncronus Chat App](https://github.com/user-attachments/assets/19b45214-b594-48b2-afff-9e1a486aeeca)

2. **Authentication Page**

   ![Auth Page](https://github.com/user-attachments/assets/51f75870-e37a-4048-80a7-435cd4add55a)

3. **User Profile Page**  

   ![Profile Page](https://github.com/user-attachments/assets/c7e8d9ba-c2d1-4f0c-9b56-5832d079f055)

4. **Search Contacts**  

   ![Search Contacts](https://github.com/user-attachments/assets/4d330e47-dc34-4e4f-beef-36b6f2dc5d78)

5. **Create Channel Page**  

   ![Create Channel](https://github.com/user-attachments/assets/e2da0bc0-743c-4d00-bd5d-c6284a446099)

6. **Chat Container View**

   ![Chat Container](https://github.com/user-attachments/assets/51ca4e26-3a46-4b6d-b56b-039d724037e7)

## Deployment

- **Backend**: The backend is deployed on **Railway**, providing a reliable and scalable environment to handle the application's API, user authentication, messaging, and file uploads.
- **Frontend**: The frontend is deployed on **Netlify**, ensuring fast and global content delivery with automatic builds and continuous deployment from the Git repository.

## Live Demo

Try the live version of **Syncronus Chat App**: [Syncronus Chat App](https://syncronus.netlify.app/)
