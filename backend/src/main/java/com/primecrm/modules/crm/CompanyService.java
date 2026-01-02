package com.primecrm.modules.crm;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.primecrm.core.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final ContactRepository contactRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompany(@lombok.NonNull UUID id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    @Transactional
    public Company createCompany(@lombok.NonNull Company company) {
        return companyRepository.save(company);
    }

    public List<Contact> getContactsByCompany(@lombok.NonNull UUID companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company not found with id: " + companyId);
        }
        return contactRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Company updateCompany(@lombok.NonNull UUID id, @lombok.NonNull Company company) {
        Company existing = getCompany(id);
        if (company.getName() != null)
            existing.setName(company.getName());
        if (company.getIndustry() != null)
            existing.setIndustry(company.getIndustry());
        if (company.getWebsite() != null)
            existing.setWebsite(company.getWebsite());
        if (company.getPhone() != null)
            existing.setPhone(company.getPhone());
        return java.util.Objects.requireNonNull(companyRepository.save(existing));
    }

    @Transactional
    public void deleteCompany(@lombok.NonNull UUID id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found with id: " + id);
        }
        companyRepository.deleteById(id);
    }
}
