import api from './axios';
import { postApi, tagApi, commentApi } from './services/blogService';
import aiApi from './services/aiService';

export {
  api as default,
  postApi,
  tagApi,
  commentApi,
  aiApi
}; 