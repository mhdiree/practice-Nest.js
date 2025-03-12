import { Controller, Get, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { transferDto } from "./dto/transfer.dto";
import { depositDto } from "./dto/deposit.dto";

@ApiTags("Account")
@Controller("account")
@UseGuards(AuthGuard()) // 로그인한 사용자만
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post("/create")
    @ApiOperation({ summary: "계좌 생성" })
    @ApiResponse({ status: 200, description: "계좌 생성 완료" })
    @ApiResponse({ status: 401, description: "계좌 생성 실패" })
    async createAccount(@Req() req) {
        return this.accountService.createAccount(req.user);
    }

    @Get("/balance")
    @ApiOperation({ summary: "잔액 조회" })
    @ApiResponse({ status: 200, description: "잔액 반환" })
    @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
    async getBalance(@Req() req) {
        return this.accountService.getBalance(req.user);
    }

    @Post("/deposit")
    @ApiOperation({ summary: "입금" })
    @ApiResponse({ status: 200, description: "입금 성공" })
    @ApiResponse({ status: 400, description: "잘못된 요청" })
    @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
    async deposit(@Req() req, @Body() depositDTO: depositDto) { //사용자 정보, 본문
        return this.accountService.deposit(req.user, depositDTO);
    }

    @Post("/transfer")
    @ApiOperation({ summary: "송금" })
    @ApiResponse({ status: 200, description: "송금 성공" })
    @ApiResponse({ status: 400, description: "잘못된 요청" })
    @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
    async transfer(@Req() req, @Body() transferDTO: transferDto) {
        return this.accountService.transfer(req.user, transferDTO);
    }
}
