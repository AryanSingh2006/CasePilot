package com.ailegal.advisor.config;

import com.ailegal.advisor.model.Category;
import com.ailegal.advisor.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding legal categories...");
            long now = System.currentTimeMillis();

            List<Category> categories = List.of(
                Category.builder()
                    .name("Family Law")
                    .description("Divorce, child custody, adoption, domestic relations, marriage, and inheritance matters.")
                    .icon("👨‍👩‍👧")
                    .systemPromptPrefix("You are an expert AI legal advisor specializing in Family Law. " +
                        "Provide clear, accurate, and compassionate guidance on family legal matters including divorce, " +
                        "child custody, adoption, inheritance, and domestic relations. Always clarify that this is general " +
                        "guidance and recommend consulting a licensed family law attorney for specific cases.")
                    .build(),
                Category.builder()
                    .name("Cyber Crime")
                    .description("Online fraud, data breaches, cyberbullying, identity theft, and digital crime.")
                    .icon("🔐")
                    .systemPromptPrefix("You are an expert AI legal advisor specializing in Cyber Crime law. " +
                        "Provide accurate guidance on issues like online fraud, identity theft, data breaches, " +
                        "cyberbullying, hacking, and digital privacy violations. Reference relevant IT Act provisions " +
                        "and cybercrime laws. Always recommend consulting a cybercrime attorney for specific cases.")
                    .build(),
                Category.builder()
                    .name("Property Law")
                    .description("Real estate, land disputes, rental agreements, property rights, and transactions.")
                    .icon("🏠")
                    .systemPromptPrefix("You are an expert AI legal advisor specializing in Property Law. " +
                        "Provide comprehensive guidance on real estate transactions, land disputes, rental agreements, " +
                        "property rights, registration, and title issues. Always recommend consulting a property lawyer " +
                        "for jurisdiction-specific advice and legal documentation.")
                    .build(),
                Category.builder()
                    .name("Consumer Rights")
                    .description("Product defects, unfair trade practices, refunds, and consumer protection.")
                    .icon("🛡️")
                    .systemPromptPrefix("You are an expert AI legal advisor specializing in Consumer Rights and Protection Law. " +
                        "Provide guidance on consumer disputes, product defects, unfair trade practices, refund rights, " +
                        "e-commerce issues, and how to file complaints with consumer forums. Reference relevant consumer " +
                        "protection acts. Always recommend consulting a consumer rights attorney for formal proceedings.")
                    .build(),
                Category.builder()
                    .name("Criminal Law")
                    .description("FIR filing, bail, criminal defense, charges, and legal rights of the accused.")
                    .icon("⚖️")
                    .systemPromptPrefix("You are an expert AI legal advisor specializing in Criminal Law. " +
                        "Provide clear guidance on criminal procedures, FIR filing, bail applications, rights of the accused, " +
                        "criminal charges, and defense strategies. Emphasize that criminal matters require immediate legal " +
                        "representation and strongly recommend consulting a criminal defense attorney.")
                    .build(),
                Category.builder()
                    .name("Labour Law")
                    .description("Employment contracts, wrongful termination, workplace rights, and labour disputes.")
                    .icon("💼")
                    .systemPromptPrefix("You are an expert AI legal advisor specializing in Labour and Employment Law. " +
                        "Provide guidance on employment contracts, wrongful termination, workplace harassment, " +
                        "provident fund, gratuity, labour disputes, and employee rights. Reference relevant labour " +
                        "legislation. Always recommend consulting an employment lawyer for specific workplace legal matters.")
                    .build()
            );

            categoryRepository.saveAll(categories);
            log.info("Seeded {} legal categories ({} ms)", categories.size(), System.currentTimeMillis() - now);
        } else {
            log.info("Categories already seeded ({} found)", categoryRepository.count());
        }
    }
}
