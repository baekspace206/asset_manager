import { PortfolioService } from './portfolio.service';
import { UsersService } from '../users/users.service';
export declare class PortfolioController {
    private readonly portfolioService;
    private readonly usersService;
    constructor(portfolioService: PortfolioService, usersService: UsersService);
    createSnapshot(req: any): Promise<import("./entities/portfolio-snapshot.entity").PortfolioSnapshot>;
    getGrowthData(startDate?: string, endDate?: string): Promise<{
        date: string;
        value: number;
    }[]>;
}
