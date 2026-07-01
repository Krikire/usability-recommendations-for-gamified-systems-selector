import xml.etree.ElementTree as ET

def get_column_value_types(file_path, decision_id, column_name):
    namespaces = {
        "dmn": "https://www.omg.org/spec/DMN/20191111/MODEL/"
    }

    tree = ET.parse(file_path)
    root = tree.getroot()

    decision = root.find(f".//dmn:decision[@id='{decision_id}']", namespaces)
    if decision is None:
        print(f"❌ No <decision> with id='{decision_id}' found.")
        return set(), set()

    decision_table = decision.find("dmn:decisionTable", namespaces)
    if decision_table is None:
        print(f"❌ No <decisionTable> inside <decision id='{decision_id}'>.")
        return set(), set()

    inputs = decision_table.findall("dmn:input", namespaces)
    target_index = -1
    for idx, input_tag in enumerate(inputs):
        label = input_tag.attrib.get("label", "").strip()
        expr_tag = input_tag.find("dmn:inputExpression", namespaces)
        expr_text = expr_tag.find("dmn:text", namespaces).text.strip() if expr_tag is not None else ""
        if label == column_name or expr_text == column_name:
            target_index = idx
            break

    if target_index == -1:
        print(f"❌ Column '{column_name}' not found.")
        return set(), set()

    single_values = set()
    multi_values = set()
    rules = decision_table.findall("dmn:rule", namespaces)

    for rule in rules:
        input_entries = rule.findall("dmn:inputEntry", namespaces)
        if len(input_entries) > target_index:
            text_tag = input_entries[target_index].find("dmn:text", namespaces)
            if text_tag is not None and text_tag.text:
                raw_value = text_tag.text.strip()

                # Remove outer quotes if any (DMN loves quoting strings)
                if raw_value.startswith('"') and raw_value.endswith('"'):
                    raw_value = raw_value[1:-1]

                if "," in raw_value:
                    parts = [part.strip() for part in raw_value.split(",")]
                    for val in parts:
                        if val:
                            multi_values.add(val)
                else:
                    if raw_value:
                        single_values.add(raw_value)

    return single_values, multi_values

single_values, multi_values = get_column_value_types("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_15i8im0", "usabilityGoal")
print("Single Values:", single_values)
print("Multi Values:", multi_values)