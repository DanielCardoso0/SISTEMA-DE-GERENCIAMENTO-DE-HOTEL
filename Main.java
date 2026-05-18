// FICHEIRO: Main.java


public class Main {

    public static void main(String[] args) {

        Login login = new Login();

        boolean acesso = login.autenticar();

        if (acesso) {

            SistemaHotel sistema = new SistemaHotel();

            // CARREGAR FUNCIONÁRIOS DO FICHEIRO
            sistema.carregarFuncionarios();

            // INICIAR MENU
            sistema.menu();

        } else {

            System.out.println("\nEncerrando sistema...");
        }
    }
}