import React, { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DetailedDocumentation() {
  const [expanded, setExpanded] = useState<string | null>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const Section = ({ id, title, children }: any) => (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(expanded === id ? null : id)}
        className="w-full flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 mb-4"
      >
        {expanded === id ? (
          <ChevronDown className="w-5 h-5 text-white" />
        ) : (
          <ChevronRight className="w-5 h-5 text-white" />
        )}
        <span className="text-lg font-bold text-white">{title}</span>
      </button>
      {expanded === id && (
        <div className="bg-slate-800/30 rounded-lg p-6 border border-indigo-500/10">
          {children}
        </div>
      )}
    </div>
  );

  const CodeBox = ({ code, lang = "java" }: any) => (
    <pre
      className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-indigo-500/20 text-sm font-mono my-3"
      style={{ color: "#f0f9ff" }}
    >
      <code style={{ color: "#f0f9ff" }}>{code}</code>
    </pre>
  );

  const Step = ({ num, title, content }: any) => (
    <div className="mb-6 bg-slate-900/50 p-4 rounded-sm border-l-2 border-indigo-200">
      <div className="flex gap-3 items-start">
        <div className="bg-indigo-600 text-white rounded-full w-9 h-6 flex items-center justify-center flex-shrink-0 font-bold">
          {num}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-indigo-300 mb-2">{title}</h4>
          <p style={{ color: "#f0f9ff" }} className="text-sm">
            {content}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <style>{`
        * {
          color: #f0f9ff !important;
        }
        .text-white, .text-indigo-300, .text-indigo-400, .text-cyan-400, .text-cyan-300 {
          color: inherit !important;
        }
        pre, code {
          color: #f0f9ff !important;
        }
        h1, h2, h3, h4, h5, h6 {
          color: inherit !important;
        }
      `}</style>

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      ></div>
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-indigo-500/20 sticky top-0 z-50 backdrop-blur">
        <Header
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                PayloadGen System Architecture
              </h1>
              <p style={{ color: "#f0f9ff" }} className="text-lg mb-12">
                Deep dive into how the generic CRUD system works
              </p>

              {/* OVERVIEW */}
              <Section id="overview" title="🎯 System Overview">
                <div className="space-y-4">
                  <p style={{ color: "#f0f9ff" }}>
                    The PayloadGen system is built on a generic CRUD
                    architecture that allows you to perform Create, Read,
                    Update, and Delete operations on any entity without writing
                    entity-specific code.
                  </p>

                  <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg mt-4">
                    <h3 className="font-bold text-indigo-300 mb-3">
                      Key Components:
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p style={{ color: "#f0f9ff" }}>
                        📌 DynamicCrudController - REST endpoints that receive
                        API requests
                      </p>
                      <p style={{ color: "#f0f9ff" }}>
                        📌 GenericCrudService - Interface defining CRUD
                        operations
                      </p>
                      <p style={{ color: "#f0f9ff" }}>
                        📌 GenericCrudServiceImpl - Implementation with
                        reflection-based entity handling
                      </p>
                      <p style={{ color: "#f0f9ff" }}>
                        📌 EntityRegistry - Central registry of entities and
                        their repositories
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* ENTITY REGISTRATION */}
              <Section id="registration" title="🔐 Entity Registration System">
                <div className="space-y-4">
                  <p style={{ color: "#f0f9ff" }}>
                    Before any operation, entities must be registered in the
                    EntityRegistry. This happens automatically when the
                    application starts.
                  </p>

                  <h4 className="font-bold text-indigo-300 mt-6 mb-3">
                    How Registration Works:
                  </h4>

                  <Step
                    num={1}
                    title="Application Startup"
                    content="Spring Boot starts and creates EntityRegistry as a @Component bean"
                  />

                  <Step
                    num={2}
                    title="Constructor Injection"
                    content="EntityRegistry receives UserRepository and ProductRepository through constructor injection"
                  />

                  <Step
                    num={3}
                    title="Entity Registration"
                    content="registerEntity() is called for each entity, storing mappings in two HashMaps"
                  />

                  <Step
                    num={4}
                    title="Verification"
                    content="Console logs show all registered entities: 'user', 'product', etc."
                  />

                  <CodeBox
                    code={`@Component
public class EntityRegistry {
    private Map<String, Class<?>> entityClasses = new HashMap<>();
    private Map<String, JpaRepository<?, ?>> repositories = new HashMap<>();

    public EntityRegistry(UserRepository userRepo, ProductRepository productRepo) {
        registerEntity("user", User.class, userRepo);
        registerEntity("product", Product.class, productRepo);
    }

    private void registerEntity(String name, Class<?> entityClass, JpaRepository<?, ?> repository) {
        entityClasses.put(name.toLowerCase(), entityClass);
        repositories.put(name.toLowerCase(), repository);
    }
}`}
                  />

                  <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-cyan-500 mt-4">
                    <p className="text-cyan-300 font-semibold mb-2">
                      What Gets Stored:
                    </p>
                    <p style={{ color: "#f0f9ff" }} className="text-sm">
                      entityClasses: user to User.class, product to
                      Product.class
                    </p>
                    <p style={{ color: "#f0f9ff" }} className="text-sm">
                      repositories: user to UserRepository, product to
                      ProductRepository
                    </p>
                  </div>
                </div>
              </Section>

              {/* ENTITY GUESSING */}
              <Section id="guessing" title="🔍 Entity Guessing Algorithm">
                <div className="space-y-4">
                  <p style={{ color: "#f0f9ff" }}>
                    When no explicit "entity" or "entityType" is provided, the
                    system analyzes payload fields to guess which entity type
                    you're working with.
                  </p>

                  <h4 className="font-bold text-indigo-300 mt-6 mb-3">
                    Step-by-Step Process:
                  </h4>

                  <Step
                    num={1}
                    title="Extract Entity Fields"
                    content="For each registered entity, get all field names and convert to lowercase for case-insensitive matching"
                  />

                  <Step
                    num={2}
                    title="Count Matching Fields"
                    content="Compare payload keys with entity fields. Count how many payload fields match entity fields"
                  />

                  <Step
                    num={3}
                    title="Calculate Matching Score"
                    content="Score = (matched fields / total entity fields). Example: 3 matched / 6 total = 0.5 (50%)"
                  />

                  <Step
                    num={4}
                    title="Apply Matching Rules"
                    content="Entity matches if: (matchCount ≥ 2) OR (score > 0.5), and has highest score"
                  />

                  <Step
                    num={5}
                    title="Return Best Match"
                    content="Return the entity with the highest score. If no match, throw error"
                  />

                  <CodeBox
                    code={`public Class<?> guessEntityByPayload(Map<String, Object> payload) {
    Class<?> bestMatch = null;
    double bestScore = 0;

    for (Map.Entry<String, Class<?>> entry : entityClasses.entrySet()) {
        Class<?> clazz = entry.getValue();
        Set<String> entityFields = Arrays.stream(clazz.getDeclaredFields())
            .map(Field::getName)
            .map(String::toLowerCase)
            .collect(Collectors.toSet());
        
        long matchCount = payload.keySet().stream()
            .map(String::toLowerCase)
            .filter(entityFields::contains)
            .count();
        
        double score = (double) matchCount / entityFields.size();
        
        if ((matchCount >= 2 || score > 0.5) && score > bestScore) {
            bestScore = score;
            bestMatch = clazz;
        }
    }
    return bestMatch;
}`}
                  />
                </div>
              </Section>

              {/* CREATE/UPDATE FLOW */}
              <Section id="create" title="➕ Create/Update Request Flow">
                <div className="space-y-4">
                  <h4 className="font-bold text-indigo-300 mb-3">
                    Request Journey:
                  </h4>

                  <Step
                    num={1}
                    title="HTTP Request Received"
                    content="POST /api/crud/create_or_update with JSON body"
                  />

                  <Step
                    num={2}
                    title="Payload Preparation"
                    content="DynamicCrudController.preparePayload() converts Object to Map"
                  />

                  <Step
                    num={3}
                    title="Service Call"
                    content="crudService.saveOrUpdate(payload) is invoked"
                  />

                  <Step
                    num={4}
                    title="Entity Resolution"
                    content="resolveEntityContext() determines which entity to save"
                  />

                  <Step
                    num={5}
                    title="Data Mapping"
                    content="mapToEntity() converts JSON to Java objects with type conversion"
                  />

                  <Step
                    num={6}
                    title="Save/Update Logic"
                    content="Checks if ID exists. If yes: update. If no: create new"
                  />

                  <CodeBox
                    code={`if (idValue != null) {
    Optional<Object> existing = genericRepo.findById(convertedId);
    if (existing.isPresent()) {
        Object existingEntity = existing.get();
        copyNonNullProperties(entity, existingEntity);
        return genericRepo.save(existingEntity); // UPDATE
    }
}
return genericRepo.save(entity); // CREATE`}
                  />
                </div>
              </Section>

              {/* FIND ALL FLOW */}
              <Section id="findall" title="🔎 Find All (List) Request Flow">
                <div className="space-y-4">
                  <h4 className="font-bold text-indigo-300 mb-3">
                    Complete Pagination & Sorting Process:
                  </h4>

                  <Step
                    num={1}
                    title="Payload Validation"
                    content="Check page ≥ 0 and size > 0. Default: page=0, size=10"
                  />

                  <Step
                    num={2}
                    title="Entity Determination"
                    content="Resolve entity using entityType or entity key, or guess from data"
                  />

                  <Step
                    num={3}
                    title="Sort Configuration"
                    content="If sortBy provided, create Sort object with direction"
                  />

                  <Step
                    num={4}
                    title="Pageable Creation"
                    content="Build Pageable object with page, size, and sort settings"
                  />

                  <Step
                    num={5}
                    title="Database Query"
                    content="repo.findAll(pageable) retrieves data slice from database"
                  />

                  <CodeBox
                    code={`{
  "status": "success",
  "page": 0,
  "size": 10,
  "totalElements": 145,
  "totalPages": 15,
  "isFirst": true,
  "isLast": false,
  "hasNext": true,
  "hasPrevious": false,
  "data": [...]
}`}
                  />
                </div>
              </Section>

              {/* FIND BY ID FLOW */}
              <Section id="findbyid" title="🔑 Find By ID Request Flow">
                <div className="space-y-4">
                  <h4 className="font-bold text-indigo-300 mb-3">
                    Single Record Retrieval Process:
                  </h4>

                  <Step
                    num={1}
                    title="Entity Resolution"
                    content="Determine entity type from 'entity' or 'entityType' in payload"
                  />

                  <Step
                    num={2}
                    title="ID Extraction"
                    content="Get 'id' value from payload. Throw error if missing"
                  />

                  <Step
                    num={3}
                    title="ID Type Conversion"
                    content="Convert ID to entity's declared ID type (Long/Integer/String)"
                  />

                  <Step
                    num={4}
                    title="Repository Query"
                    content="Call repo.findById(convertedId) to fetch from database"
                  />

                  <Step
                    num={5}
                    title="Optional Handling"
                    content="If present: return entity. If empty: throw error"
                  />
                </div>
              </Section>

              {/* DELETE FLOW */}
              <Section id="delete" title="🗑️ Delete Request Flow">
                <div className="space-y-4">
                  <h4 className="font-bold text-indigo-300 mb-3">
                    Single & Batch Deletion Process:
                  </h4>

                  <Step
                    num={1}
                    title="Entity Resolution"
                    content="Determine entity type from 'entity' or 'entityType'"
                  />

                  <Step
                    num={2}
                    title="Deletion Mode Check"
                    content="Does payload contain 'ids' (array) or 'id' (single)?"
                  />

                  <Step
                    num={3}
                    title="ID Conversion"
                    content="Convert each ID to entity's declared type"
                  />

                  <Step
                    num={4}
                    title="Batch Deletion"
                    content="Loop through all IDs and call repo.deleteById() for each"
                  />

                  <CodeBox
                    code={`if (payload.containsKey("ids")) {
    List<?> ids = (List<?>) payload.get("ids");
    List<Object> deletedIds = new ArrayList<>();
    for (Object idObj : ids) {
        Object idValue = convertIdType(idObj, entityContext.entityClass());
        repo.deleteById(idValue);
        deletedIds.add(idValue);
    }
    return Map.of("deleted", true, "count", deletedIds.size(), "ids", deletedIds);
}`}
                  />
                </div>
              </Section>

              {/* REFLECTION MAGIC */}
              <Section id="reflection" title="✨ Reflection & Type Handling">
                <div className="space-y-4">
                  <p style={{ color: "#f0f9ff" }}>
                    The system uses Java Reflection to dynamically work with
                    entities without hardcoding field names.
                  </p>

                  <h4 className="font-bold text-indigo-300 mt-6 mb-3">
                    Getting Field Information
                  </h4>

                  <CodeBox
                    code={`Field[] allFields = User.class.getDeclaredFields();
Field nameField = User.class.getDeclaredField("name");
nameField.setAccessible(true);

Object currentName = nameField.get(userObject);
nameField.set(userObject, "New Name");
Class<?> fieldType = nameField.getType();`}
                  />

                  <h4 className="font-bold text-indigo-300 mt-6 mb-3">
                    mapToEntity() Deep Dive
                  </h4>

                  <CodeBox
                    code={`private Object mapToEntity(Map<String, Object> map, Class<?> entityClass) {
    Object entity = entityClass.getDeclaredConstructor().newInstance();
    
    for (Map.Entry<String, Object> entry : map.entrySet()) {
        String fieldName = entry.getKey();
        Object value = entry.getValue();
        
        Field field = entityClass.getDeclaredField(fieldName);
        field.setAccessible(true);
        Class<?> fieldType = field.getType();
        
        if (isSimpleType(fieldType)) {
            Object convertedValue = convertToFieldType(value, fieldType);
            field.set(entity, convertedValue);
        }
    }
    return entity;
}`}
                  />
                </div>
              </Section>

              {/* FLOW DIAGRAM */}
              <Section id="diagram" title="📊 Complete Request Flow Diagram">
                <div className="space-y-6 text-sm">
                  <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-indigo-500">
                    <p className="font-bold text-indigo-300 mb-3">
                      API Request → Response Flow:
                    </p>
                    <CodeBox
                      code={`HTTP Request
    ↓
DynamicCrudController (Endpoint)
    ↓
preparePayload() - Convert to Map
    ↓
GenericCrudService Method
    ↓
resolveEntityContext() - Determine entity type
    ├─ Check "entity" key?
    ├─ Check "entityType" key?
    └─ Guess from payload fields?
    ↓
Get Repository from EntityRegistry
    ↓
Execute Operation
    ├─ CREATE/UPDATE: mapToEntity() → type conversion → save
    ├─ READ: convertIdType() → findById() → return
    ├─ LIST: Create Pageable → findAll() → return with pagination
    └─ DELETE: convertIdType() → deleteById() → return confirmation
    ↓
HTTP Response (JSON)`}
                    />
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLink({ label, id, expanded, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
        expanded === id
          ? "bg-indigo-600/50 text-indigo-200 font-semibold"
          : "text-gray-300 hover:bg-slate-800 hover:text-gray-100"
      }`}
      style={{ color: "#f0f9ff" }}
    >
      {label}
    </button>
  );
}
