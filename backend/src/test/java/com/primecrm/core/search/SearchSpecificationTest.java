package com.primecrm.core.search;

import com.primecrm.modules.crm.Contact;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings({ "null", "unchecked", "rawtypes" })
public class SearchSpecificationTest {

    @Mock
    private Root<Contact> root;
    @Mock
    private CriteriaQuery<?> query;
    @Mock
    private CriteriaBuilder builder;

    @Test
    public void givenGreaterThan_whenToPredicate_thenBuilderCalled() {
        SearchCriteria criteria = new SearchCriteria("value", ">", "100");
        BaseSpecification<Contact> spec = new BaseSpecification<>(criteria);

        Path<Object> path = mock(Path.class);
        when(root.get("value")).thenReturn(path);

        spec.toPredicate(root, query, builder);

        verify(builder).greaterThanOrEqualTo(path.as(String.class), "100");
    }

    @Test
    public void givenLessThan_whenToPredicate_thenBuilderCalled() {
        SearchCriteria criteria = new SearchCriteria("value", "<", "100");
        BaseSpecification<Contact> spec = new BaseSpecification<>(criteria);

        Path<Object> path = mock(Path.class);
        when(root.get("value")).thenReturn(path);

        spec.toPredicate(root, query, builder);

        verify(builder).lessThanOrEqualTo(path.as(String.class), "100");
    }

    @Test
    public void givenEquality_whenToPredicate_thenBuilderCalled() {
        SearchCriteria criteria = new SearchCriteria("stage", ":", "LEAD");
        BaseSpecification<Contact> spec = new BaseSpecification<>(criteria);

        Path<Object> path = mock(Path.class);
        when(root.get("stage")).thenReturn(path);
        // Assuming not String class for exact match block if logic checks type
        // In BaseSpecification: if (root.get(key).getJavaType() == String.class)
        // I need to mock getJavaType()
        when(path.getJavaType()).thenReturn((Class) Enum.class);

        spec.toPredicate(root, query, builder);

        verify(builder).equal(path, "LEAD");
    }

    @Test
    public void givenStringMatch_whenToPredicate_thenBuilderCalled() {
        SearchCriteria criteria = new SearchCriteria("firstName", ":", "John");
        BaseSpecification<Contact> spec = new BaseSpecification<>(criteria);

        Path<Object> path = mock(Path.class);
        when(root.get("firstName")).thenReturn(path);
        when(path.getJavaType()).thenReturn((Class) String.class);

        // BaseSpec: builder.like(builder.lower(root.get(...)), ...)
        // This makes mocking complex because of builder.lower()
        // We need to return an Expression from builder.lower()
        jakarta.persistence.criteria.Expression<String> expression = mock(
                jakarta.persistence.criteria.Expression.class);
        when(builder.lower(any())).thenReturn(expression);

        spec.toPredicate(root, query, builder);

        verify(builder).like(expression, "%john%");
    }
}
