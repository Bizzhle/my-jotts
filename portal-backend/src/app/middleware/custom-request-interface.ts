
import { Request } from 'express';

interface CustomRequest extends Request {
  context: any; // Define your context structure here
}

export default CustomRequest;