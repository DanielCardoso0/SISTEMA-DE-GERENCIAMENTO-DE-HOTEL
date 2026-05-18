
import java.util.ArrayList;
import java.util.Scanner;

// IMPORTS PARA FICHEIROS

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class SistemaHotel {

    Scanner sc = new Scanner(System.in);

    ArrayList<Funcionario> funcionarios = new ArrayList<>();
    ArrayList<Presenca> presencas = new ArrayList<>();

    int contadorId = 1;

    // SALVAR FUNCIONÁRIOS EM FICHEIRO

    public void salvarFuncionarios() {

        try {

            BufferedWriter writer =
                    new BufferedWriter(
                            new FileWriter("funcionarios.txt")
                    );

            for (Funcionario f : funcionarios) {

                writer.write(
                        f.getId() + ";" +
                                f.getNome() + ";" +
                                f.getBi() + ";" +
                                f.getCargo() + ";" +
                                f.getSalario() + ";" +
                                f.getTelefone() + ";" +
                                f.getTurno()
                );

                writer.newLine();
            }

            writer.close();

        } catch (IOException e) {

            System.out.println("Erro ao salvar dados!");
        }
    }
    // CARREGAR FUNCIONÁRIOS DO FICHEIRO

    public void carregarFuncionarios() {

        try {

            BufferedReader reader =
                    new BufferedReader(
                            new FileReader("funcionarios.txt")
                    );

            String linha;

            while ((linha = reader.readLine()) != null) {

                String[] dados = linha.split(";");

                int id = Integer.parseInt(dados[0]);
                String nome = dados[1];
                String bi = dados[2];
                String cargo = dados[3];
                double salario =
                        Double.parseDouble(dados[4]);
                String telefone = dados[5];
                String turno = dados[6];

                Funcionario funcionario =
                        new Funcionario(
                                id,
                                nome,
                                bi,
                                cargo,
                                salario,
                                telefone,
                                turno
                        );

                funcionarios.add(funcionario);

                // ACTUALIZAR CONTADOR DE ID

                if (id >= contadorId) {

                    contadorId = id + 1;
                }
            }

            reader.close();

        } catch (IOException e) {

            System.out.println(
                    "Nenhum ficheiro encontrado. "
                            + "Criando novo sistema..."
            );
        }
    }
    // VERIFICAR BI DUPLICADO

    public boolean biExiste(String bi) {

        for (Funcionario f : funcionarios) {

            if (f.getBi().equalsIgnoreCase(bi)) {

                return true;
            }
        }

        return false;
    }

    // VERIFICAR TELEFONE DUPLICADO
    public boolean telefoneExiste(String telefone) {

        for (Funcionario f : funcionarios) {

            if (f.getTelefone().equals(telefone)) {

                return true;
            }
        }

        return false;
    }

    public void cadastrarFuncionario() {

        System.out.println("\n========== CADASTRO ==========");

        // NOME
        System.out.print("Nome: ");
        String nome = sc.nextLine();

        // BI VALIDADO

        String bi;

        while (true) {

            System.out.print("BI: ");
            bi = sc.nextLine().toUpperCase();

            if (!bi.matches("^[0-9]{9}[A-Z]{2}[0-9]{3}$")) {

                System.out.println("BI inválido!");
                System.out.println("Exemplo válido: 003456789LA042");

            } else if (biExiste(bi)) {

                System.out.println("Este BI já está cadastrado!");

            } else {

                break;
            }
        }
        // CARGO

        System.out.print("Cargo: ");
        String cargo = sc.nextLine();

        // SALÁRIO VALIDADO

        double salario = 0;
        boolean salarioValido = false;

        while (!salarioValido) {

            try {

                System.out.print("Salário: ");
                salario = Double.parseDouble(sc.nextLine());

                if (salario <= 0) {

                    System.out.println("Salário inválido!");

                } else {

                    salarioValido = true;
                }

            } catch (NumberFormatException e) {

                System.out.println("Digite apenas números!");
            }
        }

        // TELEFONE VALIDADO

        String telefone;

        while (true) {

            System.out.print("Telefone: ");
            telefone = sc.nextLine();

            if (!telefone.matches("^[29][0-9]{8}$")) {

                System.out.println("Número inválido!");
                System.out.println("Exemplo válido: 923456789");

            } else if (telefoneExiste(telefone)) {

                System.out.println("Este telefone já está cadastrado!");

            } else {

                break;
            }
        }

        // TURNO

        System.out.print("Turno: ");
        String turno = sc.nextLine();

        // CRIAR FUNCIONÁRIO

        Funcionario funcionario = new Funcionario(
                contadorId,
                nome,
                bi,
                cargo,
                salario,
                telefone,
                turno
        );

        funcionarios.add(funcionario);

        // SALVAR FICHEIRO

        salvarFuncionarios();

        System.out.println("\nFuncionário cadastrado com sucesso!");
        System.out.println("ID do funcionário: " + contadorId);

        contadorId++;
    }

    // LISTAR FUNCIONÁRIOS
  
    public void listarFuncionarios() {

        if (funcionarios.isEmpty()) {

            System.out.println("\nNenhum funcionário cadastrado.");
            return;
        }

        System.out.println("\n====== LISTA DE FUNCIONÁRIOS ======");

        for (Funcionario f : funcionarios) {

            f.mostrarDados();
        }
    }

    // PESQUISAR FUNCIONÁRIO

    public void pesquisarFuncionario() {

        int id;

        try {

            System.out.print("\nDigite o ID do funcionário: ");
            id = Integer.parseInt(sc.nextLine());

        } catch (NumberFormatException e) {

            System.out.println("Digite apenas números!");
            return;
        }

        boolean encontrado = false;

        for (Funcionario f : funcionarios) {

            if (f.getId() == id) {

                f.mostrarDados();
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {

            System.out.println("\nFuncionário não encontrado.");
        }
    }

    // EDITAR FUNCIONÁRIO

    public void editarFuncionario() {

        int id;

        try {

            System.out.print("\nDigite o ID do funcionário: ");
            id = Integer.parseInt(sc.nextLine());

        } catch (NumberFormatException e) {

            System.out.println("Digite apenas números!");
            return;
        }

        boolean encontrado = false;

        for (Funcionario f : funcionarios) {

            if (f.getId() == id) {

                encontrado = true;

                System.out.println("\n===== EDITAR FUNCIONÁRIO =====");

                System.out.print("Novo nome: ");
                f.setNome(sc.nextLine());

                System.out.print("Novo cargo: ");
                f.setCargo(sc.nextLine());

                // SALÁRIO VALIDADO

                double salario = 0;
                boolean salarioValido = false;

                while (!salarioValido) {

                    try {

                        System.out.print("Novo salário: ");
                        salario = Double.parseDouble(sc.nextLine());

                        if (salario <= 0) {

                            System.out.println("Salário inválido!");

                        } else {

                            salarioValido = true;
                        }

                    } catch (NumberFormatException e) {

                        System.out.println("Digite apenas números!");
                    }
                }

                f.setSalario(salario);

                // TELEFONE VALIDADO

                String telefone;

                while (true) {

                    System.out.print("Novo telefone: ");
                    telefone = sc.nextLine();

                    if (!telefone.matches("^[29][0-9]{8}$")) {

                        System.out.println("Número inválido!");

                    } else {

                        break;
                    }
                }

                f.setTelefone(telefone);

                System.out.print("Novo turno: ");
                f.setTurno(sc.nextLine());

                // SALVAR ALTERAÇÕES

                salvarFuncionarios();

                System.out.println("\nFuncionário actualizado com sucesso!");

                break;
            }
        }

        if (!encontrado) {

            System.out.println("\nFuncionário não encontrado.");
        }
    }

    // REMOVER FUNCIONÁRIO


    public void removerFuncionario() {

        int id;

        try {

            System.out.print("\nDigite o ID do funcionário: ");
            id = Integer.parseInt(sc.nextLine());

        } catch (NumberFormatException e) {

            System.out.println("Digite apenas números!");
            return;
        }

        boolean removido = false;

        for (Funcionario f : funcionarios) {

            if (f.getId() == id) {

                funcionarios.remove(f);

                // SALVAR ALTERAÇÕES

                salvarFuncionarios();

                System.out.println("\nFuncionário removido com sucesso!");

                removido = true;
                break;
            }
        }

        if (!removido) {

            System.out.println("\nFuncionário não encontrado.");
        }
    }

    // REGISTRAR PRESENÇA
    public void registrarPresenca() {

        int id;

        try {

            System.out.print("\nDigite o ID do funcionário: ");
            id = Integer.parseInt(sc.nextLine());

        } catch (NumberFormatException e) {

            System.out.println("Digite apenas números!");
            return;
        }

        boolean encontrado = false;

        for (Funcionario f : funcionarios) {

            if (f.getId() == id) {

                encontrado = true;

                System.out.println("\n1 - Presente");
                System.out.println("2 - Faltou");

                System.out.print("Escolha: ");
                String opcao = sc.nextLine();

                String estado;

                if (opcao.equals("1")) {

                    estado = "Presente";

                } else {

                    estado = "Faltou";
                }

                Presenca p = new Presenca(
                        f.getId(),
                        f.getNome(),
                        estado
                );

                presencas.add(p);

                System.out.println("\nPresença registrada!");

                break;
            }
        }

        if (!encontrado) {

            System.out.println("\nFuncionário não encontrado.");
        }
    }

    // LISTAR PRESENÇAS

    public void listarPresencas() {

        if (presencas.isEmpty()) {

            System.out.println("\nNenhuma presença registrada.");
            return;
        }

        System.out.println("\n====== PRESENÇAS ======");

        for (Presenca p : presencas) {

            p.mostrarPresenca();
        }
    }
    // RELATÓRIO COMPLETO

    public void relatorio() {

        System.out.println("\n========== RELATÓRIO ==========");

        System.out.println("Total de funcionários: "
                + funcionarios.size());

        double totalSalarios = 0;

        for (Funcionario f : funcionarios) {

            totalSalarios += f.getSalario();
        }

        System.out.println("Total salarial: "
                + totalSalarios + " Kz");

        int presentes = 0;
        int faltosos = 0;

        for (Presenca p : presencas) {

            if (p.getEstado().equals("Presente")) {

                presentes++;

            } else {

                faltosos++;
            }
        }

        System.out.println("Funcionários presentes: "
                + presentes);

        System.out.println("Funcionários faltosos: "
                + faltosos);
    }

    // MENU PRINCIPAL

    public void menu() {

        int opcao = 0;

        do {
            System.out.println(" MENU PRINCIPAL ");
        
            System.out.println("1 - Cadastrar Funcionário");
            System.out.println("2 - Listar Funcionários");
            System.out.println("3 - Pesquisar Funcionário");
            System.out.println("4 - Editar Funcionário");
            System.out.println("5 - Remover Funcionário");
            System.out.println("6 - Registrar Presença");
            System.out.println("7 - Listar Presenças");
            System.out.println("8 - Relatório");
            System.out.println("9 - Sair");

            System.out.print("\nEscolha uma opção: ");

            try {

                opcao = Integer.parseInt(sc.nextLine());

            } catch (NumberFormatException e) {

                opcao = -1;
            }

            switch (opcao) {

                case 1:
                    cadastrarFuncionario();
                    break;

                case 2:
                    listarFuncionarios();
                    break;

                case 3:
                    pesquisarFuncionario();
                    break;

                case 4:
                    editarFuncionario();
                    break;

                case 5:
                    removerFuncionario();
                    break;

                case 6:
                    registrarPresenca();
                    break;

                case 7:
                    listarPresencas();
                    break;

                case 8:
                    relatorio();
                    break;

                case 9:
                    System.out.println("\nSistema encerrado.");
                    break;

                default:
                    System.out.println("\nOpção inválida!");
            }

        } while (opcao != 9);
    }
}