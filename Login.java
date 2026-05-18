import java.util.Scanner;

public class Login {

    private final String usuarioCorreto = "admin";
    private final String senhaCorreta = "2026";

    public boolean autenticar() {

        Scanner sc = new Scanner(System.in);

        System.out.println("=================================");
        System.out.println(" HOTEL MANAGEMENT SYSTEM ");
        System.out.println("=================================");

        System.out.print("Usuário: ");
        String usuario = sc.nextLine();

        System.out.print("Senha: ");
        String senha = sc.nextLine();

        if (usuario.equals(usuarioCorreto)
                && senha.equals(senhaCorreta)) {

            System.out.println("\nLogin realizado com sucesso!");
            return true;

        } else {

            System.out.println("\nUsuário ou senha incorrectos!");
            return false;
        }
    }
}