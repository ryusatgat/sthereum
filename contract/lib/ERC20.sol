// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

/**
 * @dev EIP에 정의된 ERC20 표준 인터페이스 추가 함수를 포함하지 않습니다;
 * 이들에 접근하려면 `ERC20Detailed`을 확인하세요.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {
    /**
     * @dev 두 부호 없는 정수의 합을 반환합니다.
     * 오버플로우 발생 시 예외처리합니다.
     *
     * 솔리디티의 `+` 연산자를 대체합니다.
     *
     * 요구사항:
     * - 덧셈은 오버플로우될 수 없습니다.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev 두 부호 없는 정수의 차를 반환합니다.
     * 결과가 음수일 경우 오버플로우입니다.
     *
     * 솔리디티의 `-` 연산자를 대체합니다.
     *
     * 요구사항:
     * - 뺄셈은 오버플로우될 수 없습니다.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev 두 부호 없는 정수의 곱을 반환합니다.
     * 오버플로우 발생 시 예외처리합니다.
     *
     * 솔리디티의 `*` 연산자를 대체합니다.
     *
     * 요구사항:
     * - 곱셈은 오버플로우될 수 없습니다.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // 가스 최적화: 이는 'a'가 0이 아님을 요구하는 것보다 저렴하지만,
        // 'b'도 테스트할 경우 이점이 없어집니다.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev 두 부호 없는 정수의 몫을 반환합니다. 0으로 나누기를 시도할 경우
     * 예외처리합니다. 결과는 0의 자리에서 반올림됩니다.
     *
     * 솔리디티의 `/` 연산자를 대체합니다. 참고: 이 함수는
     * `revert` 명령코드(잔여 가스를 건들지 않음)를 사용하는 반면, 솔리디티는
     * 유효하지 않은 명령코드를 사용해 복귀합니다(남은 모든 가스를 소비).
     *
     * 요구사항:
     * - 0으로 나눌 수 없습니다.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // 솔리디티는 0으로 나누기를 자동으로 검출하고 중단합니다.
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // 이를 만족시키지 않는 경우가 없어야 합니다.

        return c;
    }

    /**
     * @dev 두 부호 없는 정수의 나머지를 반환합니다. (부호 없는 정수 모듈로 연산),
     * 0으로 나눌 경우 예외처리합니다.
     *
     * 솔리디티의 `%` 연산자를 대체합니다. 이 함수는 `revert`
     * 명령코드(잔여 가스를 건들지 않음)를 사용하는 반면, 솔리디티는
     * 유효하지 않은 명령코드를 사용해 복귀합니다(남은 모든 가스를 소비).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}