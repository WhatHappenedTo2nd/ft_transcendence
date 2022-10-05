import { CustomRepository } from "src/typeorm-ex/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { ChatUser } from "./chatuser.entity";

@CustomRepository(ChatUser)
export class ChatUserRepository extends Repository<ChatUser> {
}
