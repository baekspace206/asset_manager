import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { UsersService } from '../users/users.service';
export declare class AssetsController {
    private readonly assetsService;
    private readonly usersService;
    constructor(assetsService: AssetsService, usersService: UsersService);
    create(createAssetDto: CreateAssetDto, req: any): Promise<import("./entities/asset.entity").Asset>;
    findAll(): Promise<import("./entities/asset.entity").Asset[]>;
    findOne(id: string): Promise<import("./entities/asset.entity").Asset>;
    update(id: string, updateAssetDto: UpdateAssetDto, req: any): Promise<import("./entities/asset.entity").Asset>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
